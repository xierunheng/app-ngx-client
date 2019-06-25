import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements AfterViewInit, OnDestroy {
  _value: number;

  @Input()
  set value(value: number) {
    this._value = value;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit(){
    this.init();
  }

init() {
    
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series : [
            {
                name:'OEE',
                type:'gauge',
                startAngle: 180,
                endAngle: 0,
                center : ['50%', '84%'],    // 默认全局居中
                radius : 150,
                splitLine:{show:false},
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 80,
                        color:[
                            [0.2, '#ff4c6a'],
                            [0.8, '#ffa100'],
                            [1, '#40dc7e']
                        ]
                    }
                },
                axisTick: {  
                    show:false,          // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :12,        // 属性length控制线长
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    formatter: function(v){
                        // console.log(v);
                        switch (v){
                            case '10': return '低';
                            case '50': return '中';
                            case '90': return '高';
                            default: return '';
                        }
                    },
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'green',
                        fontSize: 15,
                        fontWeight: 'bolder'
                    }
                },
                pointer: {
                    width:10,
                    length: '60%',
                    color: 'rgba(255,255,255,0.8)'
                },
                title : {
                    show : true,
                    offsetCenter: [0, '-60%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 30
                    }
                },
                detail : {
                    show : true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: [0, -40],       // x, y，单位px
                    formatter:'{value}%',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize:30
                    }
                },
                data:[{value: this._value, name: 'OEE'}],
                itemStyle:{fontSize:30}
            }
        ]
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
