import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { LocalDataSource } from 'ng2-smart-table';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { PaclassService } from '../../../@core/data/paclass.service';
import { IPaclass, Paclass, IPaclassElite } from '../../../@core/model/paclass';
import { PhysicalAssetService } from '../../../@core/data/physical-asset.service';
import { IPhysicalAsset, PhysicalAsset, IPAElite } from '../../../@core/model/physical-asset';
import { UtilData, TableSettings } from '../../../@core/data/util.service';

import { PaClassInfoComponent } from './pa-class-info/pa-class-info.component';
import { PaInfoComponent } from './pa-info/pa-info.component';

@Component({
  selector: 'mes-physical-asset',
  templateUrl: './physical-asset.component.html',
  styleUrls: ['./physical-asset.component.scss']
})
export class PhysicalAssetComponent implements OnInit {

  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  pacs: IPaclass[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //树状呈现personnel
  patree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: PaclassService,
    private paService: PhysicalAssetService,
    private dialogServie: NbDialogService) {
    this.initSetting(); }

    initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '工装类型名称',
        type: 'string',
      },
      code: {
        title: '类型编码',
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
      manufacture: {
        title: '生产厂家',
        type: 'string',
        valuePrepareFunction: (manufacture, row) => {
          return row.manufacture ? row.manufacture.code + '-' + row.manufacture.oid : '';
        },
        filterFunction: (value, search) => {
          return value.oid && value.code &&
            `${value.code}-${value.oid}`.toString().toLowerCase().includes(search.toString().toLowerCase());
        }


        // valuePrepareFunction: (manufacture, row) => {
        //   return row.manufacture && row.manufacture.length > 0 ? row.manufacture.join(',') : '';
        // },

      //   title: '生产厂家',
      //   type: 'string',
      //   valuePrepareFunction: (manufacture, row) => {
      //     return row.manufacture && row.manufacture.length > 0 ? row.manufacture.map(item => item.toString()).join(',') : '';
      //   },
      //   filterFunction: (value, search) => {
      //     return value.findIndex(v => (v && v.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      //   }
      },
      prop: {
        title: '属性数量',
        type: 'string',
        valuePrepareFunction: (prop, row) => {
          return `${row.prop ? row.prop.length : 0}个`;
        }
      },
      physicalAssets: {
        title: '工装数量',
        type: 'html',
        valuePrepareFunction: (physicalAssets, row) => {
          return `<a href="#/pages/maintenance/physical-asset/pa-list/?paclass.oid=${row.oid}">${row.physicalAssets ? row.physicalAssets.length : 0}项</a>`;
        }
      }
    };
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.loading = true;
    this.service.getPaclasss().subscribe(pacs => {
      this.source.load(pacs);
      this.pacs = pacs;
      this.patree = this.service.createPaTree(pacs);
      console.log(this.patree);
      this.loading = false;
    });
   }

   /**
    * [创建新的 paclass]
    * @param {IPaclass = undefined} pac [description]
    */
  createPac(pac: IPaclass = undefined): void {
    this.dialogServie.open(PaClassInfoComponent, {
      context: {
        title: `新建 工装类型`,
        model: pac || new Paclass()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createPaclass(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的 PhysicalAsset]
   * @param {IPhysicalAsset = undefined} pa [description]
   */
  createPA(pa: IPhysicalAsset = undefined): void {
    this.dialogServie.open(PaInfoComponent, {
      context: {
        title: `新建 工装`,
        model: pa || new PhysicalAsset(),
        // operate:"create"
      },
    }).onClose.subscribe(rn => {
      console.log(rn);
      if (rn) {
        this.paService.createPhysicalAsset(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改 paclass]
   * @param {IPaclass} pac [description]
   */
  editPac(pac: IPaclass): void {
    let modelObserver = jsonpatch.observe(pac);
    this.dialogServie.open(PaClassInfoComponent, {
      context: {
        title: `更新工装类型 [${pac.oid}] 信息`,
        model: pac,
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchPaclass(pac._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  editPA(pa: IPAElite): void {
    this.paService.getPhysicalAsset(pa._id).subscribe(pa => {
      let modelObserver = jsonpatch.observe(pa);
      this.dialogServie.open(PaInfoComponent, {
        context: {
          title: `更新工装 [${pa.oid}] 信息`,
          model: pa,
          // operate:"update"
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.paService.patchPhysicalAsset(pa._id, patch).subscribe(item => {
            this.init();
          })
        }
      });
    })
  }

  removePac(pac: IPaclass): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deletePaclass(pac).subscribe(() => {
        this.init();
      });
    }
  }

  removePA(pa: IPhysicalAsset): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.paService.deletePhysicalAsset(pa).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    if (item === UtilData.systemObj.physicalAsset.name) {
      //增加工装类型
      this.createPac();
    } else {
      let physicalAsset = new PhysicalAsset();
      physicalAsset.DeriveFromPaclasss([item]);
      //增加工装
      this.createPA(physicalAsset);
    }
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.physicalAsset.name) {

    } else if (item.code) {
      //增加工装类型
      this.editPac(item);
    } else {
      //增加工装
      this.editPA(item);
    }
    // if (item === UtilData.systemObj.physicalAsset.name) {

    // } else if (item.name) {
    //   //增加实物资产
    //   this.editPA(item);
    // } else {
    //   //增加实物资产类型
    //   this.editPac(item);
    // }
  }

  removeItem(item): void {
    if (item === UtilData.systemObj.physicalAsset.name) {

    } else if (item.code) {
      //删除工装类型
      this.removePac(item);
    } else {
      //删除physicalAsset
      this.removePA(item);
    }
  }

  onDelete(event): void {
    this.service.deletePaclass(event).subscribe(() => { });
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}
