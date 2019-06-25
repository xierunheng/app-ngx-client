import { AfterViewInit, Component, OnDestroy, Input ,Output,EventEmitter} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as _ from 'lodash';
import { EchartBarData,IOptionSet } from '../../../../@core/model/echart';

@Component({
  selector: 'ngx-myechart-bar',
  templateUrl: './myechart-bar.component.html',
  styleUrls: ['./myechart-bar.component.scss']
})

export class MyechartBarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  data: EchartBarData = new EchartBarData();
  fontSize:number=18;

  //自定义的局部echart样式
  newOption:any = {};
  @Output() outPutData = new EventEmitter();


  //optionSet对象包括两个部分
  //options为需要配置的局部echart样式，写法根据标准的echart配置
  //其它为自定义的公共参数，目前只有参数fontSize,后续根据需要再配置
  //eg:optionSet={
  //   options:{},
  //   fontSize:20
  // };
  _optionSet:IOptionSet;
  @Input('optionSet')
  set optionSet(value) {
    this._optionSet = value;
    this.init();  
  }

  //barData：为echart的动态参数、一般需要和服务端交互
  //optionSet：为需要自定义的echart样式
  _barData:EchartBarData;
  @Input('barData')
  set barData(value: EchartBarData) {
    this._barData = value;
    this.init();
  };

  constructor(private theme: NbThemeService) {
    console.log("hellow");
  }

  onChartClick(e){
    this.outPutData.emit(e.name)
  };

  init(){
    if(this._optionSet){
      this.fontSize = this._optionSet&&this._optionSet.fontSize?this._optionSet.fontSize:this.fontSize;     
      this.newOption = this._optionSet&&this._optionSet.options?this._optionSet.options:{};

    }
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
          backgroundColor: echarts.bg,
          color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
          title: {//标题
            text: this.data.titleText || '',
            textStyle: {
              color:'#212529',
              fontSize:this.fontSize
            },
          },
          tooltip: {//辅助线
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {//图例
            data: this.data.legendData || [],
            // data: this.data && this.data.length > 0 ? this.data.map(item => item.name) : [],
            textStyle: {
              fontSize:this.fontSize
            },
          },
          toolbox: {//转化工具
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {readOnly:false},
                  magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          xAxis: [
            {
              type: 'category',           
              data: this.data.xData || [],
              axisLine: {
                lineStyle: {
                  // color: "#06A9F9",
                  color: "#000",
                },
              },
              axisLabel: {//x轴刻度的样式修改
                 textStyle: {
                   color: "#06A9F9"
                 },
                 fontSize:this.fontSize
              }
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: "black",
                },
              },
              axisLabel: {
                fontSize:this.fontSize,
              },
            },
          ],
          series: this.data.series || [],//柱图的数值
        };
      });

    if( this._barData){
      this.options = Object.assign({}, this.options,this.newOption);
      this.options.title.text = this._barData.titleText;
      this.options.legend.data = this._barData.legendData;
      this.options.xAxis[0].data = this._barData.xData;
      this.options.series = this._barData.series;
      // this.chartInit();
      

      
    }
  }

  chartInit(){
    
  }

  ngAfterViewInit() {
    this.init();
    
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

