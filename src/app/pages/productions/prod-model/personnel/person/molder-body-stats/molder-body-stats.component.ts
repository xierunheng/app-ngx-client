import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { TreeviewItem } from 'ngx-treeview';

import { UtilData, IDCmpFn, TableSettings } from '../../../../../../@core/data/util.service';
import { BarData, EchartBar, EchartBarData } from '../../../../../../@core/model/job-response';
import { Person } from '../../../../../../@core/model/person';
import { MaterialData } from '../../../../../../@core/data/util.service';
import { MsubLotService } from '../../../../../../@core/data/msublot.service';
import { PsubService } from '../../../../../../@core/data/psub.service';
import { PersonService } from '../../../../../../@core/data/person.service';


@Component({
  selector: 'mes-molder-body-stats',
  templateUrl: './molder-body-stats.component.html',
  styleUrls: ['./molder-body-stats.component.scss']
})
export class MolderBodyStatsComponent implements OnInit {
  //查询周期
  period: string = 'month';

  //可能从查询周期
  periods: any[] = [{
    name: '按月',
    value: 'month',
  }, {
    name: '按周',
    value: 'week',
  }, {
    name: '按天',
    value: 'date',
  }];

  //统计开始时间
  startTime: Date = new Date('1970-01-01');
  //统计结束时间
  endTime: Date = new Date();
  //周期时间
  periodTime: Date;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  qcs: any[];

  qccolumns = {
    molder: {
      title: '成型工',
      type: 'string',
    },
    mdef: {
      title: '型号',
      type: 'string',
    },
    total: {
      title: '总数',
      type: 'number',
    },
    Defective: {
      title: '有缺陷',
      type: 'number',
    },
    Checked: {
      title: '优等品',
      type: 'number',
    },
    NG: {
      title: '等外品',
      type: 'number',
    },
    OK: {
      title: '再检优等品',
      type: 'number',
    },
    Scraped: {
      title: '已报废',
      type: 'number',
    },
    Idle: {
      title: '已停滞',
      type: 'number',
    },
  };

  reasons: any[];

  rcolumns = {
    molder: {
      title: '成型工',
      type: 'string',
    },
    mdef: {
      title: '型号',
      type: 'string',
    },
    qcState: {
      title: '质检结果',
      type: 'string',
    },
    reason: {
      title: '缺陷项',
      type: 'string',
    },
    count: {
      title: '数量',
      type: 'number',
    },
  };

  idles: any[];

  idlecolumns = {
    molder: {
      title: '成型工',
      type: 'string',
    },
    mdef: {
      title: '型号',
      type: 'string',
    },
    opState: {
      title: '操作状态',
      type: 'string'
    },
    count: {
      title: '数量',
      type: 'number',
    }

  };

  constructor(private location: Location,
    private mslService: MsubLotService,
    private pService: PersonService,
    private psubService: PsubService) { }

  ngOnInit() {
  }

  onPeriodTimeChange(event) {
  //  console.log(event);
    this.periodTime = event;
    if (event) {
      this.startTime = moment(this.periodTime).startOf(this.period as unitOfTime.StartOf).toDate();
      this.endTime = moment(this.periodTime).endOf(this.period as unitOfTime.StartOf).toDate();
    }
  }

  calcQcs(items: any) {
    this.qcs = [];
    _.forOwn(_.groupBy(items, 'molder'), (value, key) => {
      _.forOwn(_.groupBy(value, 'mdef'), (mvalue, mkey) => {
        let qc: any = {
          molder: mvalue[0].molder,
          mdef: mvalue[0].mdef,
          total: mvalue.map(mv => mv.count).reduce((prev, curr) => prev + curr),
          Defective: 0,
          Checked: 0,
          NG: 0,
          OK: 0,
          Scraped: 0,
          Idle: 0,
        };
        mvalue.forEach(mv => qc[mv.qcState] = mv.count);
        this.qcs.push(qc);
      });
    });
  }

  onSubmit(value) {
    let groups: string[] = ['qcState', 'molder', 'mdef'];
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), groups)
      .subscribe(items => {
        console.log(items);
        this.calcQcs(items);
      });
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['qcState', 'molder', 'mdef', 'reason'], {}, 'reason')
      .subscribe(items => {
        this.reasons = items;
      });
    this.mslService.aggrOPTimely(this.startTime.toString(), this.endTime.toString(), ['opState', 'molder', 'mdef'], { 'qcState': 'Idle' })
      .subscribe(items => {
    //    console.log(items);
        this.idles = items;
      });

  }

  /**
   * [返回上一级]
   */
  goBack(): void {
    this.location.back();
  }
}
