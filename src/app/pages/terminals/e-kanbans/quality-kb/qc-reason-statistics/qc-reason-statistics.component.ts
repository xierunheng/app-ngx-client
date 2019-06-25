import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../@core/data/util.service';

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
import { NbThemeService } from '@nebular/theme';

interface EcharReasonData {
  count: number;
  reason: string;
}

@Component({
  selector: 'mes-qc-reason-statistics',
  templateUrl: './qc-reason-statistics.component.html',
  styleUrls: ['./qc-reason-statistics.component.scss']
})
export class QcReasonStatisticsComponent implements OnInit {

  _data: EcharReasonData[];

  @Input()
  set data(data: EcharReasonData[]) {
    this._data = data;
    console.log(data);
    if (data) {
      this.calcReasoncs(data);
    }
  }

  total: number = 0;

  //统计开始时间
  startTime: Date = new Date('2019-03-21');
  //统计结束时间
  endTime: Date = new Date('2019-03-22');


  //缺陷统计情况
  reason_Statistics: EchartBarData;

  reasons: any[];

  rcolumns = {
//    qcState: {
//      title: '质检结果',
//      type: 'string',
//    },
    reason: {
      title: '缺陷项',
      type: 'string',
    },
    count: {
      title: '数量',
      type: 'number',
    },
    sum: {
      title: '缺陷累加',
      type: 'number',
    },
    rate: {
      title: '缺陷占比',
      type: 'number',
    },
    rate_Sum: {
      title: '缺陷占比累加',
      type: 'number',
    },
  };

  fontSize=20;

  // 局部echart样式
  optionSet= new OptionSet();


  constructor(private location: Location,
    private mslService: MsubLotService,
    private pService: PersonService,
    private mService: MdefService) { }

  ngOnInit() {

    // let query = {};

    // let groups: string[] = ['qcState', 'molder', 'mdef', 'qcTime'];
    // this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
    //   .subscribe(items => {
    //     console.log(items);
    //    if (items.length > 0)
    //      {this.calcReasoncs(items);};
    //   });

  }

  calcReasoncs(items: any) {
    this.reasons=[];
    this.total = items.map(mv => mv.count).reduce((prev, curr) => prev + curr);//累积总数

    let reason_temp: any[] = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    if (this.total){
      let count_sum: number  = 0;
      _.forEach(reason_temp, (value, key)=>{
        count_sum = value.count + count_sum;
        let reason: any = {
          reason: value.reason,
          count: value.count,
          sum: count_sum,
          rate: ((value.count/this.total)*100).toFixed(2),
          rate_Sum: ((count_sum/this.total)*100).toFixed(2),
        };
        this.reasons.push(reason);
      });
    }

    this.optionSet.fontSize = this.fontSize;
    this.optionSet.options = {
      toolbox: {
          show : false,
      },
      legend: {//图例
        textStyle: {
          color: "#edf2f5",
          fontSize:this.fontSize
        },
      },
      yAxis: [
          {
              type: 'value',
              name: '数量',
              nameTextStyle:{
                fontSize :this.optionSet.fontSize-5,
              },
              // min: 0,
              // max: 25,
              position: 'left',
              offset: -5,
              axisLine: {
                  lineStyle: {
                      color: "#edf2f5"
                  }
              },
              axisLabel: {
                  formatter: '{value}个',
                  fontSize:this.optionSet.fontSize,
              }
          },
          {
              type: 'value',
              name: '占比',
              min: 0,
              max: 100,
              splitLine:{show:false},
              position: 'right',
              offset: -5,
              nameTextStyle:{
                fontSize :this.optionSet.fontSize-5,
              },
              axisLine: {
                  lineStyle: {
                      color: "#ff386a"
                  }
              },
              axisLabel: {
                  formatter: '{value} %',
                  fontSize:this.optionSet.fontSize,

              }
          },

      ],
      xAxis: [
        {
          type: 'category', 
          // data:this.reasons.map(item => item.reason),        
          axisLine: {
            lineStyle: {
              color: "#edf2f5",
            },
          },
          axisLabel: {
             textStyle: {
               color: "#edf2f5"
             }, 
             fontSize:this.fontSize            
          },
          nameTextStyle:{
            color: "#edf2f5" 
          },
        },
      ],

    };
     

    this.reasons = _.take(this.reasons,5); //取前五
    console.log(this.reasons);
    this.reason_Statistics = {
      titleText: '',
      legendData: ['数量','占比'],
      xData: this.reasons.map(item => item.reason),
      series: [{
        name: '数量',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { normal: { label: { show: true, position: 'top',fontSize:this.optionSet.fontSize } } },
        data: this.reasons.map(item => item.count)
      },
      {
        name: '占比',
        type: 'line',
        barWidth: '40%',
        yAxisIndex: 1,
        itemStyle: { normal: { label: { show: true, position: 'bottom',fontSize:this.optionSet.fontSize,color:"#ff386a"},lineStyle:{  
                                        color:'#ff386a'  
                                    }   } },
        data: this.reasons.map(item => item.rate_Sum)
      }]
    };

//    console.log(this.total);
  }


  onSubmit(value) {

  }


}
