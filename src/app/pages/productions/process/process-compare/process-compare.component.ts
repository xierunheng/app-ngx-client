import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EquipmentData } from '../../../../@core/model/edata';
import { EquipData, NameCmpFn } from '../../../../@core/data/util.service';
import { EdataService } from '../../../../@core/data/edata.service';
import * as _ from 'lodash';
import * as moment from 'moment';
// import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'mes-process-compare',
  templateUrl: './process-compare.component.html',
  styleUrls: ['./process-compare.component.scss']
})
export class ProcessCompareComponent implements OnInit {
    equipNames: string[];

    //设备名称
    equipName: string;

    //统计的起始时间
    startTime: Date;

    //统计的结束时间
    endTime: Date;

    equipParas: any[];

    //设备参数列表
    equipPara: any;

    nameCmpFn = NameCmpFn;
    option: any;
    data: any[] = [];
    xData:any[];

    themeSubscription: any;


    constructor(private theme: NbThemeService,
        private edService: EdataService) { 
    this.startTime = moment().subtract(30, 'day').toDate();
    this.endTime = new Date();
  }

    ngOnInit() {
        let equips = _.values(EquipData.plcKiln).slice(0, -1);
        this.equipNames = equips.map(item => item.text);
        this.equipParas = _.values(equips[0]).filter(item => !_.isString(item));
    }

    analyse(): void {
        this.data = [];
        let paraQuery = {
            'equipment.name': this.equipName,
            name: this.equipPara.name,
            startTime:this.startTime,
            endTime:this.endTime

            // startTime: { $gte: this.startTime, $lte: this.endTime }
        };

        this.edService.getEdatasBy(paraQuery).subscribe(items => {
            // console.log(items);
            if (items && items.length > 0) {
                items.forEach(item => {
                    let values = [];
                    let xData = [];

                    // console.log(this.startTime);
                    let time = moment(this.startTime);
                    // console.log(time);

                        _.forOwn(item.metrics, (hourValue, hourKey) => {
                            let hour = Number(hourKey);
                            _.forOwn(hourValue, (minuteValue, minuteKey) => {
                                let minute = Number(minuteKey);
                                time.hour(hour);
                                time.minute(minute);
                                // console.log(time);
                                // console.log(time.format());
                                // values.push([time.format(), minuteValue]);
                                values.push(minuteValue);
                                xData.push(hour+"时"+minute+"分");
                            });
                        });

                        // console.log(values);
                    this.xData = xData;
                    this.data.push({
                        name: item.startTime,
                        data: values,
                    })
                })

                // console.log(this.data);
                if (this.data && this.data.length > 0 && this.option) {
                    if (this.option.series) {
                        // console.log(this.equipPara.name);
                        this.option.title.text = this.equipPara.name;
                        // console.log("数据",this.data)
                        this.option.series = this.data.map(item => {

                            return {
                                name: moment(item.name).format('YY年MM月DD日'),
                                type: 'line',
                                data: item.data,
                                markPoint: {
                                    data: [
                                        { type: 'max', name: '最大值' },
                                        { type: 'min', name: '最小值' }
                                    ]
                                },
                            };
                        });
                    }
                    if (this.option.legend) {
                        // console.log(this.data)
                        this.option.legend.data = this.data.map(item => moment(item.name).format('YY年MM月DD日'));
                    }
                    if (this.option.xAxis) {
                        // console.log(this.data)
                        this.option.xAxis[0].data = this.xData;
                    }
                    // console.log("env",this.option.series)
                    this.option = Object.assign({}, this.option);
                }
            }else{
        alert("该时间段设备采集的信息为空")
      }
        });

    }

      ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = ['#000000','#FF0033'];
      const echarts: any = config.variables.echarts;

      this.option = {
        backgroundColor: echarts.bg,
        title:{
          text:"请先选择要对比的设备参数",
          x: '45%',
          y:'1%',
          textStyle: {
              fontSize:18,
              color:colors[0]
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',//提示交叉线
              label: {
                  backgroundColor: '#6a7985',
                  fontSize:18
              }
          },
          textStyle: {
            fontSize: 20,
          },
          position: function (pos, params, el, elRect, size) {//控制提示框位置
              var obj = {top: 10};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
          }  
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        dataZoom: {
          show: true,
          type: 'slider',
          xAxisIndex: [0],
          filterMode: 'filter'
        },
        legend: {
          textStyle:{fontSize:18},
          type:"scroll",
          top:'10%',
          data: this.data && this.data.length > 0 ? this.data.map(item => moment(item.name).format('YY年MM月DD日')) : [],
        },
        grid: {
          y2: 80,
          // left: '10%',
          // right: '0%',
          height: 320,
          bottom: 80
        },
        xAxis: [
          {
            type: 'category',
            splitNumber: 10,
            axisLabel: {
               fontSize:16,
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name:'',
            axisLabel: {
              fontSize:18,
            },
            min:'dataMin',
            max:'dataMax',
            splitNumber:'5',
            axisLine: {
              lineStyle: {
                color: colors[1],
              },
            },
          }
        ],
        animation: true,
        series: this.data && this.data.length > 0 ? this.data.map(item => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,            
            showSymbol:false,
            sampling:'average',
            showAllSymbol: false,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
          };
        }) : [],
      };
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}
