import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { EclassService } from '../../../../@core/data/eclass.service';
import { EquipmentService } from '../../../../@core/data/equipment.service';
import { IEclass, Eclass, IEclassProfile } from '../../../../@core/model/eclass';
import { IEquipment, Equipment, IEquipmentElite } from '../../../../@core/model/equipment';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { EclassInfoComponent } from './eclass-info/eclass-info.component';
import { EquipInfoComponent } from './equip-info/equip-info.component';



@Component({
  selector: 'mes-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();
  ecs: IEclass[];
  eclasss: IEclassProfile[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //查询条件
  query: any = {};

  //树状呈现equipment
  etree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: EclassService,
    private eService: EquipmentService,
    private dialogService: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;

    this.settings.columns = {
      oid: {
        title: '类型名称',
        type: 'string',
      },
      code: {
        title: '编号',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      prop: {
        title: '属性列',
        type: 'string',
        valuePrepareFunction: (prop, row) => {
          return `${row.prop ? row.prop.length : 0}个`;
        }
      },
      equipments: {
        title: '设备数量',
        type: 'html',
        valuePrepareFunction: (equip, row) => {
          // return `${row.equipments ? row.equipments.length : 0}人`;
         return `<a href="#/pages/productions/equipment/equip-list/?eclass.oid=${row.oid}">${row.equipments ? row.equipments.length : 0}台</a>`;
        }
      }
    };
  }

  onDelete(event): void {
    this.service.deleteEclass(event).subscribe(() => {
    });
  }

  ngOnInit() {
    this.init();
    this.route.queryParams.subscribe((params)=>{
      this.query = _.cloneDeep(params);
      if(this.query['hs.path']) {
        this.query['hs.path'] = {$regex: this.query['hs.path']};
      }
      this.init();
        console.log(params);
    })
  }

  init(): void {
    this.loading = true;
    // this.service.getEclasss().subscribe(ecs => {
    this.service.searchEclasssEncode(this.query).subscribe(ecs => {
      this.source.load(ecs);
      this.ecs = ecs;
      this.etree = this.service.createETree(ecs);
      this.loading = false;
    });
  }

  /**
   * [创建新的 Eclass]
   * @param {IEclass = undefined} ec [description]
   */
  createEc(ec: IEclass = undefined): void {
    this.dialogService.open(EclassInfoComponent, {
      context: {
        title: `新建 设备类型`,
        model: ec || new Eclass()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createEclass(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的设备]
   * @param {IEquipment = undefined} e [description]
   */
  createE(e: IEquipment = undefined): void {
    this.dialogService.open(EquipInfoComponent, {
      context: {
        title: `新建 设备`,
        model: e || new Equipment()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.eService.createEquipment(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改 Eclass]
   * @param {IEclass} ec [description]
   */
  editEc(ec: IEclass): void {
    let modelObserver = jsonpatch.observe(ec);
    this.dialogService.open(EclassInfoComponent, {
      context: {
        title: `更新 [${ec.oid}] 信息`,
        model: ec
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchEclass(ec._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改 equipment]
   * @param {IEquipmentElite} e [description]
   */
  editE(e: IEquipmentElite): void {
    this.eService.getEquipment(e._id).subscribe(e => {
      let equip = new Equipment(e);
      let modelObserver = jsonpatch.observe(equip);
      this.dialogService.open(EquipInfoComponent, {
        context: {
          title: `更新 [${equip.oid}] 信息`,
          model: equip,
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.eService.patchEquipment(equip._id, patch).subscribe(item => {
            this.init();
          })
        }
      });
    })
  }

  /**
   *删除 Eclass
   * @param {IEclass} ec [description]
   */
  removeEc(ec: IEclass): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteEclass(ec).subscribe(() => {
        this.init();
      });
    }
  }

  removeE(e: IEquipment): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.eService.deleteEquipment(e).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    if (item === UtilData.systemObj.equipment.name) {
      //增加设备类型
      this.createEc();
    } else {
      let equip: IEquipment = new Equipment();
      equip = this.eService.deriveFromEclasss(equip, [item]);
      //增加设备
      this.createE(equip);
    }
  }

  editItem(item): void {
    if (item === UtilData.systemObj.equipment.name) {

    } else if (item.name) {
      //修改设备
      this.editE(item);
    } else {
      //修改设备类型
      this.editEc(item);
    }
  }

  removeItem(item): void {
    if (item === UtilData.systemObj.equipment.name) {

    } else if (item.name) {
      //删除设备
      this.removeE(item);
    } else {
      //删除设备类型
      this.removeEc(item);
    }
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }


  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }
}
