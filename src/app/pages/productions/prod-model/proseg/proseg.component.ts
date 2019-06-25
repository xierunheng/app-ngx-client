import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import * as moment from 'moment';

import { ProsegService } from '../../../../@core/data/proseg.service';
import { IProseg, Proseg } from '../../../../@core/model/proseg';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { ProsegInfoComponent } from './proseg-info/proseg-info.component';

@Component({
  selector: 'mes-proseg',
  templateUrl: './proseg.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ProsegComponent implements OnInit, OnDestroy {

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  prosegs: IProseg[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;
  //查询条件
  query: any = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: ProsegService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      code: {
        title: '编号',
        type: 'string',
      },
      no: {
        title: '序号',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      opType: {
        title: '类型',
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
      pubDate: {
        title: '发布时间',
        type: 'string',
        valuePrepareFunction: (pubDate, row) => {
          return row.pubDate ? moment(row.pubDate).format('YYYY-MM-DD HH:mm') : '';
        },
      },
      duration: {
        title: '生产节拍',
        type: 'string',
        valuePrepareFunction: (duration, row) => {
          return row.duration && row.duration.quantity ? (row.duration.quantity + row.duration.unit) : '';
        },
        filterFunction: (value, search) => {
          return value.quantity && value.unit &&
            `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
    };
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
    this.service.searchProsegsEncode(this.query).subscribe(pss => {
      this.prosegs = pss;
      this.source.load(pss);
      this.loading = false;
    });
  }


  /**
   * [创建新的hs]
   * @param {IProseg = undefined} ps [description]
   */
  create(ps: IProseg = undefined): void {
    this.dialogServie.open(ProsegInfoComponent, {
      context: {
        title: `新建 层级结构`,
        model: ps || new Proseg()
      },
    }).onClose.subscribe(rn => {
      if(rn) {
        this.service.createProseg(rn).subscribe(item => {
          // this.source.prepend(item);
          this.init();
        })
      }
    });
  }

  /**
   * [修改hs]
   * @param {IProseg} ps [description]
   */
  edit(ps: IProseg): void {
    let modelObserver = jsonpatch.observe(ps);
    this.dialogServie.open(ProsegInfoComponent, {
      context: {
        title: `更新 [${ps.oid}] 信息`,
        model: ps 
      },
    }).onClose.subscribe(rn => {
      if(rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchProseg(ps._id, patch).subscribe(item => {
          // this.source.refresh();
          this.init();
        })
      }
    });
  }

  /**
   * [删除hs]
   * @param {IProseg} ps [description]
   */
  remove(ps: IProseg): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteProseg(ps).subscribe(() => {
        // this.source.remove(hs);
        // this.source.refresh();
        this.init();
      });
    }
  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}
