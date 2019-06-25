import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../../@core/data/orders-profit-chart';
import { OrdersChart } from '../../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../../@core/utils/layout.service';
import { IQuantity } from '../../../../../@core/model/common';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

@Component({
  selector: 'mes-integration-energy-month',
  templateUrl: './integration-energy-month.component.html',
  styleUrls: ['./integration-energy-month.component.scss']
})
export class IntegrationEnergyMonthComponent implements OnDestroy {
  private alive = true;

  _jrs: any[];
  @Input()
  set jrs(jrs: any[]) {
    this._jrs = jrs;
    this.init(jrs);
  }

  //产量趋势呈现的数据
  qtyData: any[];

  PQ: IQuantity;

  //质量指标呈现的数据
  qrData: any[];

  GQ: IQuantity;

  //废品率呈现的数据
  srData: any[];

  SQ: IQuantity;

  chartPanelSummary: OrderProfitChartSummary[];

  options: any = {};
  echartsIntance: any;
  themeSubscription: any;

  summary: any = [{
    title: '综合能耗',
    value: 83,
  }, {
    title: '月产量',
    value: 128,
  }, {
    title: '耗天然气量',
    value: 21,
  }];

  constructor(private theme: NbThemeService,
              private themeService: NbThemeService,
              private mslService: MsubLotService) { 
      this.init([])
  }
  init(items: any[]) {
      console.log(items);
    if (items && items.length > 0) {

      this.qtyData = items.map(item => {
        return {
          oid: moment(item.startTime).format("MM-DD"),
          qty: item.qty.quantity + item.ngqty.quantity
        }
      });
      console.log(this.qtyData);
      // this.PQ = {
      //   quantity: this.qtyData.map(item => item.qty).reduce((prev, curr) => prev + curr),
      //   unit: items[0].qty.unit
      // };

      // this.qrData = items.map(item => {
      //   return {
      //     oid: item.oid,
      //     qty: item.qty.quantity,
      //     ratio: _.round(item.qty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
      //   }
      // });
      // this.GQ = {
      //   quantity: this.qrData.map(item => item.qty).reduce((prev, curr) => prev + curr),
      //   unit: items[0].qty.unit
      // };

      // this.srData = items.map(item => {
      //   return {
      //     oid: item.oid,
      //     qty: item.ngqty.quantity,
      //     ratio: _.round(item.ngqty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
      //   }
      // });
      // this.SQ = {
      //   quantity: this.srData.map(item => item.qty).reduce((prev, curr) => prev + curr),
      //   unit: items[0].qty.unit
      // };
    }
    // 综合能耗趋势图

    // let xdata = this.qtyData.map(item=>item.oid);
    let xdata= _.map(this.qtyData,item=>item.oid)
    // let qtyMonth = 
    console.log(xdata);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors = config.variables;
          const echarts: any = config.variables.echarts;

          this.options = {
            backgroundColor: echarts.bg,
            color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
              textStyle: {
                fontSize: 20,
              },
            },
            toolbox: {
              feature: {
                dataView: { show: false, readOnly: false },
                restore: { show: false },
                saveAsImage: { show: false }
              }
            },
            legend: {
              data: ['综合能耗', '耗天然气量','产量'],
              textStyle: {
                fontSize: 18,
                color: echarts.textColor,
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                data: xdata,
                axisTick: {
                  alignWithLabel: true,
                },
                axisLine: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
                axisLabel: {
                  fontSize: 18,
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: 'dataMax',
                axisLine: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: echarts.splitLineColor,
                  },
                },
                axisLabel: {
                  fontSize: 18,
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
              {
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: echarts.splitLineColor,
                  },
                },
                axisLabel: {
                  fontSize: 18,
                  formatter: '{value}%',
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
            ],
            series: [
                {
                  name: '综合能耗',
                  type: 'line',
                  itemStyle: { normal: { label: { show: true, position: 'top' } } },
                  data: _.map(this.qtyData,item=>item.qty+1000)
                },{
                  name: '耗电量',
                  type: 'line',
                  itemStyle: { normal: { label: { show: true, position: 'top' } } },
                  areaStyle: {},
                  data: _.map(this.qtyData,item=>item.qty)
                },
                // {
                //   name: '产量',
                //   type: 'bar',
                //   itemStyle: { normal: { label: { show: true, position: 'top' } } },
                //   areaStyle: {},
                //   data: _.map(this.qtyData,item=>item.qty)
                // }
            ]
        }
      })    
  }

    



  ngOnDestroy() {
    this.alive = false;

  }

}
