import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';

import { LocalDataSource } from 'ng2-smart-table';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../../../@core/model/global';
import { EnclassService } from '../../../../@core/data/enclass.service';
import { EnDefService } from '../../../../@core/data/endef.service';
import { IEnclass, Enclass, EnclassElite } from '../../../../@core/model/enclass';
import { IEnergyDefinition, IEnergyElite, EnergyDefinition } from '../../../../@core/model/endef';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';

import { EnclasInfoComponent } from './enclas-info/enclas-info.component';
import { EndefInfoComponent } from './endef-info/endef-info.component';



@Component({
  selector: 'mes-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss']
})
export class EnergyComponent implements OnInit {
  // enclasss: IEnclassProfile[];
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  //查询条件
  query: any = {};  

  //树状呈现personnel
  entree: TreeviewItem[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '类型名称',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction:(hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
       },
    };
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: EnclassService,
    private endService: EnDefService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  ngOnInit() {
    this.init();
    this.route.queryParams.subscribe((params)=>{
      this.query = _.cloneDeep(params);
      if(this.query['hs.path']) {
        this.query['hs.path'] = {$regex: this.query['hs.path']};
      }
      this.init();
    })
  }

  init(): void {
    this.loading = true;
    this.service.searchEnclassEncode(this.query)
      .subscribe(enclasss => {
          this.source.load(enclasss);
          this.loading = false;
          this.entree = this.service.createEnTree(enclasss);
      });
  }

  /**
   * [创建新的Enclass]
   * @param {IEnclass = undefined} Enclass [description]
   */
  createEnc(enclass: IEnclass = undefined): void {
    this.dialogServie.open(EnclasInfoComponent, {
      context: {
        title: `新建 能源类型`,
        model: enclass || new Enclass()
      },
    }).onClose.subscribe(enclass => {
      if(enclass) {
        this.service.createEnclass(enclass).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的EnDef]
   * @param {IEnergyDefinition = undefined} End [description]
   */
  createEnDef(end: IEnergyDefinition = undefined): void {
    this.dialogServie.open(EndefInfoComponent, {
      context: {
        title: `新建 能源`,
        model: end || new EnergyDefinition()
      },
    }).onClose.subscribe(end => {
      console.log(end);
      if(end) {
        this.endService.createEnDef(end).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改Enclass]
   * @param {IEnclass} Enclass [description]
   */
  editEnc(enclass: IEnclass): void {
    let oldenclass: IEnclass = _.cloneDeep(enclass);
    let modelObserver = jsonpatch.observe(enclass);
    this.dialogServie.open(EnclasInfoComponent, {
      context: {
        title: `更新 能源类型 信息`,
        model: enclass
      },
    }).onClose.subscribe(rnEnclass => {
      if(rnEnclass) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchEnclass(enclass._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改EnDef]
   * @param {IEnclass} Enclass [description]
   */
  editEnDef(end: IEnclass): void {
    this.endService.getEnDef(end._id).subscribe(end => {
      let modelObserver = jsonpatch.observe(end);
      this.dialogServie.open(EndefInfoComponent, {
        context: {
          title: `更新 [${end.oid}] 信息`,
          model: end,
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.endService.patchEnDef(end._id, patch).subscribe(item => {
            this.init();
          })
        }
      });

    })
  }

  /**
   * [删除enclass]
   * @param {IEnclass} enclass [description]
   */
  removeEnc(enclass: IEnclass): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteEnclass(enclass).subscribe(() => {
        this.init();
      });
    }
  }

  /**
   * [删除enDef]
   * @param {IEnclass} enclass [description]
   */
  removeEnDef(end: IEnergyDefinition): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.endService.deleteEnDef(end).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    if (item === UtilData.systemObj.energy.name) {
      //增加员工类型
      this.createEnc();
    } else {
      let endef = new EnergyDefinition();
      endef.DeriveFromEnclasss([item]);
      //增加员工
      this.createEnDef(endef);
    }
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.energy.name) {

    } else if (item.endefs) {
      //增加能源定义
      this.editEnc(item);
    } else {
      //增加能源类型
      this.editEnDef(item);
    }
  }

  removeItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.energy.name) {

    } else if (item.endefs) {
      //增加能源定义
      this.removeEnc(item);
    } else {
      //增加能源类型
      this.removeEnDef(item);
    }
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }


  onDelete(event): void {
    this.service.deleteEnclass(event)
      .subscribe(() => {
      });
  }


}
