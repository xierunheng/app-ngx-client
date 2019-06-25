import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import * as moment from 'moment';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { KpiDefinitionService } from '../../../../@core/data/kpi-def.service';
import { KpiService } from '../../../../@core/data/kpi.service';
import { IKpiDef, KpiDef, IKpiDefElite } from '../../../../@core/model/kpi-def';
import { IKpi, Kpi, IKpiElite } from '../../../../@core/model/kpi';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { KpiDefInfoComponent } from './kpi-def-info/kpi-def-info.component';
import { KpiInfoComponent } from './kpi-info/kpi-info.component';

@Component({
  selector: 'mes-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KpiComponent implements OnInit {

  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  //树状呈现personnel
  kpitree: TreeviewItem[];

  //查询条件
  query: any = {};

  kpids: IKpiDef[];

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

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
    this.settings.  columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      name: {
        title: '名称',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      scope: {
        title: '应用范围',
        type: 'string',
      },
      formula: {
        title: '公式',
        type: 'string',
      },
      unit: {
        title: '计量单位',
        type: 'string',
      },
      range: {
        title: '值域',
        type: 'string',
        valuePrepareFunction: (range, row) => {
          return row.range ? `[${row.range.lower.valueStr}${row.range.lower.unit}, ${row.range.upper.valueStr}${row.range.upper.unit}]` : '';
        },
      },
      kpi: {
        title: 'kpi',
        type: 'html',
        valuePrepareFunction: (kpi, row) => {
         return `<a href="#/pages/productions/kpi/equip-list/?eclass.oid=${row.oid}">${row.kpi ? row.kpi.length : 0}个</a>`;
        }
      },
      trend: {
        title: '趋势',
        type: 'string',
      },
      timing: {
        title: '时间设置',
        type: 'string',
      },
      audience: {
        title: '用户',
        type: 'string',
      },
      prodMethodology: {
        title: '生产方式',
        type: 'string',
      },
      notes: {
        title: '备注',
        type: 'string',
      }
    };
  }

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: KpiDefinitionService,
    private kpiService: KpiService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=>{
      this.query = _.cloneDeep(params);
      if(this.query['hs.path']) {
        this.query['hs.path'] = {$regex: this.query['hs.path']};
      }
      this.init();
    })
  }

  init(): void {
    this.loading = true;
    this.service.searchKpiDefsEncode(this.query).subscribe(kpids => {
      this.source.load(kpids);
      this.kpids = kpids;
      console.log(kpids);
      this.kpitree = this.service.createKpiTree(kpids);
      this.loading = false;
    });
  }

  /**
   * [创建新的KpiDef]
   * @param {IKpiDef = undefined} kpid [description]
   */
  createKpid(kpid: IKpiDef= undefined): void {
    this.dialogServie.open(KpiDefInfoComponent, {
      context: {
        title: `新建 Kpi定义`,
        model: kpid || new KpiDef()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createKpiDef(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的Kpi]
   * @param {IHierarchyScope = undefined} hs [description]
   */
  createKpi(kpi: IKpi = undefined): void {
    this.dialogServie.open(KpiInfoComponent, {
      context: {
        title: `新建 Kpi`,
        model: kpi || new Kpi()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.kpiService.createKpi(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改hs]
   * @param {IKpiDef} kpid [description]
   */
  editKpid(kpid: IKpiDef): void {
    let modelObserver = jsonpatch.observe(kpid);
    this.dialogServie.open(KpiDefInfoComponent, {
      context: {
        title: `更新 [${kpid.name}] 信息`,
        model: kpid
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchKpiDef(kpid._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改Kpi]
   * @param {IPerson} kpi [description]
   */
  editKpi(kpi: IKpiElite): void {
    this.kpiService.getKpi(kpi._id).subscribe(kpi => {
      let modelObserver = jsonpatch.observe(kpi);
      this.dialogServie.open(KpiInfoComponent, {
        context: {
          title: `更新 [${kpi.name}] 信息`,
          model: kpi,
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.kpiService.patchKpi(kpi._id, patch).subscribe(item => {
            this.init();
          })
        }
      });

    })

  }

  /**
   * [删除KpiDef]
   * @param {IKpiDef} kpid [description]
   */
  removeKpid(kpid: IKpiDef): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteKpiDef(kpid).subscribe(() => {
        this.init();
      });
    }
  }

  /**
   * [删除Kpi]
   * @param {IKpi} kpi [description]
   */
  removeKpi(kpi: IKpi): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.kpiService.deleteKpi(kpi).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.kpi.name) {
      this.createKpid();
    } else {
      let kpi = new Kpi();
      kpi.DeriveFromKpiDef(item);
      console.log(kpi);
      this.createKpi(kpi);
    }
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.personnel.name) {

    } else if (item.kpi) {
      this.editKpid(item);
    } else {
      this.editKpi(item);
    }
  }

  removeItem(item): void {
    if (item === UtilData.systemObj.personnel.name) {

    } else if (item.kpi) {
      this.removeKpid(item);
    } else {
      this.removeKpi(item);
    }
  }


  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
  }

  onDelete(event): void {
      this.service.deleteKpiDef(event)
        .subscribe(() => {
        });
  }

}
