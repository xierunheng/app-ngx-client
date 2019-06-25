import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { WorkData, MaterialData } from '../../../../@core/data/util.service';
import { SocketService } from '../../../../@core/socket/socket.service';

@Component({
  selector: 'mes-output-bar',
  styles:[`.tips{position:absolute;top:40%;left:40%;}`],
  template: `
    <div echarts [options]="options" class="echart bar" width="500" height="300"></div>
    <h1 class="tips" *ngIf="!isRunning">当前没有运行的工单! </h1>
  `,
})
export class OutputBarComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() title: string;
  @Input() bodyState: string;

  options: any = {};
  themeSubscription: any;
  echarts: any;
  colors: any;

  joOid: string;

  job: any;

  tip: string = '';
  isRunning=false;
  // fontSize = (3*1080)/(1.2451*43)
  fontSize = (2*1080)/(1.2451*43)

  SocketService;

  constructor(private theme: NbThemeService,
    private joService: JobOrderService,
    private jrServer: JobResponseService, 
    private socketService: SocketService) {
    this.SocketService = socketService;
    
  }

  ngOnInit() {
    this.SocketService.syncUpdates('materialSubLot', this.job, (event, item, array) => {
      if(event === 'findOneAndUpdate') {
        if(item && item.opState && item.opState === this.bodyState) {
          // console.log("初始值",item);
          this.joService.getAggregateSublot(this.joOid).subscribe(job => {
            this.job = job;
            let series = this.createSeries();
            this.setOptions(series);
            this.options = Object.assign({}, this.options);
          });
        }
      }
    });
  }

  setOptions(series) {
    this.colors = ["#5ce191","#66b3ff","#ffaf26","#ff6680","#9b92ff","#4b4b4b"];
    // console.log("看板颜色",this.colors);
    this.options = {
      backgroundColor: this.echarts.bg,
      // color: [this.colors.successLight, this.colors.infoLight, this.colors.warningLight, this.colors.dangerLight, this.colors.primaryLight],
      color: this.colors,
      title : {
        text: this.title + '看板',
        subtext: this.tip,
        align: 'center',
        y: '',
        textStyle: {
            // color:'red',
            fontSize:this.fontSize
        },
        left:'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','百度','谷歌','必应','其他'],
        data: series.map(item => item.name),
        type:'scroll',
        textStyle: {
          color: this.echarts.textColor,
          fontSize: this.fontSize
        },
        top:'14%',
        left:'85%',
        orient:'vertical'
      },
      grid: {
        left: '4%',
        right: '20%',
        top: '10%',
        bottom: '6%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name:'坯体型号',
          nameTextStyle:{
            fontSize :this.fontSize-10,   
          },
          nameGap :'30',
          // data : ['周一','周二','周三','周四','周五','周六','周日'],
          data: this.job.jo?this.job.jo.mReq.map(item => item.mdef.oid):"",
          axisLine: {
            lineStyle: {
            color: this.colors[5],
            },
          },
          axisLabel: {
              color: this.echarts.textColor,
              fontSize: this.fontSize,
              fontWeight:'bold'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name:'完成个数',
          nameTextStyle:{
            fontSize :this.fontSize-10,
            verticalAlign :'top',  
          },
          nameGap:'30',
          // max:100,
          // min:0,
          axisLine: {
            lineStyle: {
              color: this.colors[5],
            },
          },
          splitLine: {
            lineStyle: {
              color: this.echarts.splitLineColor,
              fontSize: this.fontSize,
              fontWeight:'bold'
            },
          },
          splitNumber:5,
          axisLabel: {
              color: this.echarts.primaryLight,
              fontSize:this.fontSize,
              fontWeight:'bold'
          },
        },
      ],
      series: series
    };
  }

  /**
   * [根据数据库获取的job信息，初始化相关的series和chart数据  ]
   */
  createSeries(): any {
    let series: any[];
    series = this.job.jr.filter(item => item.molder !== null).map(item => {
      let serizeData = this.job.jo.mReq.map(mr => {
        let mdef = item.mdefs.find(md => md.mdef === mr.mdef.oid);
        return mdef ? mdef.count : 0;
      });
      
      let serie: any = {
        name: item.molder,
        type: 'bar',
        stack: '实际',
        itemStyle: { normal: { label: { show: true, fontSize: 40, position: 'insideTop',formatter:function(p){
          return p.value > 0 ? p.value:'';
        } } } },
        data: serizeData
      };
      return serie;
    });
    series.splice(0, 0, {
      name: this.job.jo.oid,
      type: 'bar',
      stack: '计划',
      // barWidth : 30,
      itemStyle: { normal: { label: { show: false, fontSize: 40, position: 'top',formatter:function(p){console.log("计划",p);return p.value > 0 ? p.value:'';} } } },
      data: this.job.jo?this.job.jo.mReq.map(item => item.qty.quantity):""
    })
    console.log(series);
    return series;
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.echarts = config.variables.echarts;

      this.jrServer.getJobResponseBy({
        state: 'Running',
        'directive.proseg.oid': this.title, 
      }).subscribe(jr => {
        if (!jr) {
          this.isRunning = false;
          this.tip = '当前没有运行的工单!';
          this.job={};
          // console.log("job的值",this.jobOrder)
          // let series = [];
          // this.setOptions(series);
        } else {
          // console.log("running的工单信息",jr);
          this.isRunning = true;
          this.joOid = jr.oid;
          
          this.joService.getAggregateSublot(this.joOid).subscribe(job => {
            this.job = job;
            // console.log("请求返回的jo",this.jobOrder);
            let series = this.createSeries();
            this.setOptions(series);
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
