import { AfterViewInit, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { SocketService } from '../../../../@core/socket/socket.service';
import { MaterialData } from '../../../../@core/data/util.service';

class QCResult {
  defect: boolean;
  count: number;
}

class QCItem {
  reason: string;
  count: number;
}

@Component({
  selector: 'mes-quality-pie',
  template: `
    <div echarts [options]="options" class="echart pie"></div>
  `,
})
export class QualityPieComponent implements AfterViewInit, OnDestroy {
  @Input() title: string;
  @Input() bodyState: string;

  options: any = {};
  themeSubscription: any;
  echarts: any;
  colors: any;

  joOid: string;

  //质量项统计结果
  qcs: QCResult[] =[{
    defect: false,
    count: 1
  }, {
    defect: true,
    count: 0
  }];

  //质量项统计结果
  qcis: QCItem[];

  //提示内容
  tip: string = '';

  SocketService;

  //materialsublot items
  items: any;
  fontSize = (2*1080)/(1.2451*43)

  constructor(private theme: NbThemeService,
    private jrService: JobResponseService,
    private socketService: SocketService) {
    this.SocketService = socketService;
  }

  ngOnInit() {
    this.SocketService.syncUpdates('materialSubLot', this.items, (event, item, array) => {
      if (event === 'findOneAndUpdate') {
        if (item && item.opState && item.opState === this.bodyState) {
          // console.log(item);
          this.jrService.getAggregateQC(this.joOid).subscribe(qcs => {
            this.qcs = qcs;
            this.jrService.getAggregateQCItem(this.joOid).subscribe(qcis => {
              this.qcis = qcis;
              this.setOptions();
              this.options = Object.assign({}, this.options);
            });
          });
        }
      }
    });
  }

  setOptions() {
    this.options = {
      backgroundColor: this.echarts.bg,
      color: [this.colors.dangerLight, this.colors.successLight, this.colors.warningLight, this.colors.infoLight, this.colors.primaryLight],
      tooltip: {
        trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      title: [{
        text: '良品率',
        subtext: this.tip,
        x: '25%',
        y: '1%',
        textAlign: 'center',
        textStyle: {
          fontSize: this.fontSize
        },
      }, {
        text: '缺陷项',
        subtext: this.tip,
        x: '75%',
        y: '1%',
        textAlign: 'center',
        textStyle: {
          fontSize: this.fontSize
        },
      }],
       legend: {
        data:['合格项','缺陷项'],
        // data: series.map(item => item.name),
        // textStyle: {
        //   color: this.echarts.textColor,
        //   fontSize: this.fontSize
        // },
        // top:'14%',
        // left:'70%',
        // orient:'vertical'//设置图例的呈现方式
      },
      grid: [{
        // top: '50%',
        width: '50%',
        top: '10%',
        // bottom: '45%',
        left: '45%',
        containLabel: true
      }],
      xAxis: [{
        type: 'value',
        // max: builderJson.all,
        splitLine: {
          show: false
        },
        axisLine: {
          // lineStyle: {
          // color: this.echarts.axisLineColor,
          // },
        },
        axisLabel: {
          textStyle: {
            fontSize: this.fontSize,
            fontWeight:'bold'
          }
        }
      }],
      yAxis: [{
        type: 'category',
        data: this.qcis ? this.qcis.map(item => item.reason) : [],
        axisLine: {
          lineStyle: {
            color: this.echarts.axisLineColor,
          },
        },
        axisLabel: {
          interval: 0,
          rotate: 20,
          textStyle: {
            fontSize: this.fontSize,
            // fontWeight:'bold'
          }
        },
        splitLine: {
          show: false
        }
      }],
      //缺陷项
      series: [{
        type: 'bar',
        stack: 'chart',
        z: 3,
        label: {
          normal: {
            position: 'right',
            show: true,
            fontSize: this.fontSize
          }
        },
        data: this.qcis ? this.qcis.map(item => item.count): []
      }, {
        //合格率
        type: 'pie',
        radius: [0, '50%'],
        center: ['25%', '50%'],
        data: this.qcs.map(item => {
          return {
            name: item.defect ? '合格项' : '缺陷项',
            value: item.count
          }
        }),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: this.echarts.itemHoverShadowColor,
          },
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
        },
        label: {
          normal: {
            textStyle: {
              fontSize: this.fontSize,
              // fontWeight:'bold'
            },
          }
        }

      }]
    };
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.echarts = config.variables.echarts;

      this.jrService.getJobResponseBy({
        state: 'Running',
        'directive.proseg.oid': this.title,
      }).subscribe(jr => {
        if (!jr) {
          this.tip = '当前没有运行的工单';
          // this.setOptions();
        } else {
          this.joOid = jr.oid;
          this.jrService.getAggregateQC(this.joOid).subscribe(qcs => {
            this.qcs = qcs;
            // console.log(this.qcs);
            this.jrService.getAggregateQCItem(this.joOid).subscribe(qcis => {
              this.qcis = qcis;
              this.setOptions();
            })
          });
        }
      });


    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.SocketService.unsyncUpdates('materialSubLot');
  }
}
