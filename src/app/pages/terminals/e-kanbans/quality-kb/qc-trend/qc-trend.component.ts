import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'mes-qc-trend',
  templateUrl: './qc-trend.component.html',
  styleUrls: ['./qc-trend.component.scss']
})
export class QcTrendComponent implements AfterViewInit, OnDestroy {

  options: any = {};
  fontSize = 20;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
          // left: 'left',
          data: ['合格率', '报废率'],
          textStyle: {
            color: "#edf2f5",
            fontSize:this.fontSize,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9','10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: "#edf2f5"
              },
            },
            axisLabel: {
              fontSize:this.fontSize,
              textStyle: {
                color: "#edf2f5"
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: "#edf2f5"
              },
            },
            splitLine: {
              lineStyle: {
                color: "#edf2f5"
              },
            },           
            axisLabel: {
              fontSize:this.fontSize,
              textStyle: {
                color: "#edf2f5"
              },
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            name: '合格率',
            type: 'line',
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            },
            data: [79, 89, 85, 83, 89, 72, 86, 87, 80, 73, 75, 79, 78, 83, 74, 86, 86, 72, 71, 87, 75, 72, 86, 78, 87, 84, 79, 88, 85, 85],
          },
          {
            name: '报废率',
            type: 'line',
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值',itemStyle:{label:{position:'top'}}}
                ]
            },
            data: [13, 10, 20, 7, 5, 9, 2, 11, 10, 19, 1, 18, 8, 7, 17, 5, 6, 18, 7, 3, 5, 12, 3, 16, 9, 1, 8, 3, 4, 3],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

