import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../@core/data/util.service';
import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../../../../@core/model/global';
import { unitOfTime } from 'moment';
import { MsubLotService } from '../../../../../@core/data/msublot.service';
import { MdefService } from '../../../../../@core/data/mdef.service';
import { PersonService } from '../../../../../@core/data/person.service';
import { IMsubLot, MsubLot, IMsubLotProfile } from '../../../../../@core/model/msublot';
import { BarData, EchartBar, EchartBarData } from '../../../../../@core/model/job-response';
import { OptionSet } from '../../../../../@core/model/echart';

interface EcharQCData {
  count: number;
  mdef: string;
  molder: string;
  qcState: string;
}

@Component({
  selector: 'mes-qc-total-statistics',
  templateUrl: './qc-total-statistics.component.html',
  styleUrls: ['./qc-total-statistics.component.scss']
})
export class QcTotalStatisticsComponent implements OnInit {

  _data: EcharQCData[];
  @Input()
  set data(data: EcharQCData[]) {
    this._data = data;
    this.calcQcs(data);
  }


  total: number = 0;

  options: any = {};
  themeSubscription: any;

  qcData: any[] = [];

  //统计开始时间
  startTime: Date = new Date('2019-04-08');
  //统计结束时间
  endTime: Date = new Date('2019-04-09');

  qcs: any[];
  // qccolumns = {
  //   mdef: {
  //     title: '型号',
  //     type: 'string',
  //   },
  //   total: {
  //     title: '总数',
  //     type: 'number',
  //   },
  //   Defective: {
  //     title: '有缺陷',
  //     type: 'number',
  //   },
  //   Checked: {
  //     title: '优等品',
  //     type: 'number',
  //   },
  //   NG: {
  //     title: '等外品',
  //     type: 'number',
  //   },
  //   OK: {
  //     title: '再检优等品',
  //     type: 'number',
  //   },
  //   Scraped: {
  //     title: '已报废',
  //     type: 'number',
  //   },
  //   Idle: {
  //     title: '已停滞',
  //     type: 'number',
  //   },
  // };

  qc_statistics: any[] = [{
    total: {
      title: '总数',
      type: 'number',
    },
    rate_Checked: {
      title: '优等品率',
      type: 'string',
    },
    rate_Passed: {
      title: '合格率',
      type: 'string',
    },
    rate_Idle: {
      title: '停滞率',
      type: 'string',
    },
    rate_Scraped: {
      title: '报废率',
      type: 'string',
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
  }];
  //qc_statistics: any[] = [];
  // qc_statistics_columns = {
  //   total: {
  //     title: '总数',
  //     type: 'number',
  //   },
  //   rate_Checked: {
  //     title: '优等品率',
  //     type: 'string',
  //   },
  //   rate_Passed: {
  //     title: '合格率',
  //     type: 'string',
  //   },
  //   rate_Idle: {
  //     title: '停滞率',
  //     type: 'string',
  //   },
  //   rate_Scraped: {
  //     title: '报废率',
  //     type: 'string',
  //   },
  //   Defective: {
  //     title: '有缺陷',
  //     type: 'number',
  //   },
  //   Checked: {
  //     title: '优等品',
  //     type: 'number',
  //   },
  //   NG: {
  //     title: '等外品',
  //     type: 'number',
  //   },
  //   OK: {
  //     title: '再检优等品',
  //     type: 'number',
  //   },
  //   Scraped: {
  //     title: '已报废',
  //     type: 'number',
  //   },
  //   Idle: {
  //     title: '已停滞',
  //     type: 'number',
  //   },
  // };


  constructor(private theme: NbThemeService,
    private mslService: MsubLotService,
    private pService: PersonService,
    private mService: MdefService) { }

  ngOnInit() {
    // let query = {};
    // let groups: string[] = ['qcState', 'molder', 'mdef', 'qcTime'];
    // this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), groups, query)
    //   .subscribe(items => {
    //     console.log(items);
    //     this.calcQcs(items);

    //   });

    //let qcData: any[] = [];

  }

  calcQcs(items: any) {
    let statistics: any = {
      total: 0,
      Defective: 0,
      Checked: 0,
      NG: 0,
      OK: 0,
      Scraped: 0,
      Idle: 0,
      rate_Checked: '',
      rate_Passed: '',
      rate_Idle: '',
      Rate_Scraped: '',
    };
    this.qcs = [];
    this.qc_statistics = [];
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
        statistics.total = statistics.total + qc.total;
        statistics.Checked = statistics.Checked + qc.Checked;
        statistics.Defective = statistics.Defective + qc.Defective;
        statistics.NG = statistics.NG + qc.NG;
        statistics.OK = statistics.OK + qc.OK;
        statistics.Scraped = statistics.Scraped + qc.Scraped;
        statistics.Idle = statistics.Idle + qc.Idle;
      });
    });
    statistics.total=statistics.total-statistics.Idle;
    if (statistics.total) {
      statistics.rate_Checked = ((statistics.Checked/statistics.total)*100).toFixed(2);
      statistics.rate_Scraped = ((statistics.Scraped/statistics.total)*100).toFixed(2);
      statistics.rate_Passed = (((statistics.Checked+statistics.OK+statistics.NG)/statistics.total)*100).toFixed(2);
      statistics.rate_Idle = ((statistics.Idle/statistics.total)*100).toFixed(2);
    }
    this.qc_statistics.push(statistics);
    console.log(this.qc_statistics);

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          top: '12%',
          left: '1%',
          itemGap:20,
          data: ['优等品:'+statistics.Checked.toString(), '再检优等品:'+statistics.OK.toString(), '等外品:'+statistics.NG.toString(), '有缺陷:'+statistics.Defective.toString(), '已报废:'+statistics.Scraped.toString()],
          //data: items.map(item => item.name),
          textStyle: {
            color: "#edf2f5",
            fontSize: 20,
            width:30,

          },
          // type: 'scroll',
          // orient:'vertical'
        },
        series: [
          {
            // name: 'Countries',
            name: '质量统计',
            type: 'pie',
            radius: '50%',
            center: ['66%', '55%'],
            //data: items,
            data: [
              { value: statistics.Checked, name: '优等品:'+statistics.Checked.toString()},
              { value: statistics.OK, name: '再检优等品:'+statistics.OK.toString()},
              { value: statistics.NG, name: '等外品:'+statistics.NG.toString()},
              //{ value: statistics.Idle, name: '已停滞'},
              { value: statistics.Defective, name: '有缺陷:'+statistics.Defective.toString()},
              { value: statistics.Scraped, name: '已报废:'+statistics.Scraped.toString()},
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                // position:"inner",
                formatter: '{d}%',
                textStyle: {
                  color: "#edf2f5",
                  fontSize: 20
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };

    });
  }

}
