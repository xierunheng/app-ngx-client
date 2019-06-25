import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { SingleEventService } from '../../../../../@core/data/single-event.service';
import { ISingleEvent, IAlarmData} from '../../../../../@core/model/single-event';
import { ScadaDataService } from '../../../../../@core/data/scadaData.service';
import { IQuantity, Quantity} from '../../../../../@core/model/common';

@Component({
  selector: 'ngx-emaint-total',
  templateUrl: './emaint-total.component.html',
  styleUrls: ['../equipment-kb.component.scss','./emaint-total.component.scss']
})
export class EmaintTotalComponent implements OnInit, AfterViewInit {
 dataLine: any[];    //工时数据
 dataJP: any[];     //节拍
 TotalTime : number;  //总工时

 // dataOEE= [
 //    {
 //      key: '整线OEE',
 //      value: '50%'
 //    },{
 //      key: '喷釉线OEE',
 //      value: '50%'
 //    },{
 //      key: '打磨线OEE',
 //      value: '50%'
 //    }];

  data:any[];  

  private alive = true;

  currentTheme: string;

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;

  
 // paras: any[];


  constructor(private themeService: NbThemeService,
              private seService: SingleEventService,
              private scadaService: ScadaDataService,
              private breakpointService: NbMediaBreakpointsService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.themeService.getJsTheme().pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });

    this.init();
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.init();
    }, 1 * 60  * 1000);  //1分钟更新一次
  }

  ngOnInit() {
    
  }

  init(): void {

    this.scadaService.getProductionLine().subscribe(data => {
    //  console.log(data);
      this.dataLine = [
        {
          key: '设备负责人',
          value: '陈国辉'
        },{
          key: '即时状态',
          value: ''
        },{
          key: '总工时',
          value: data.WorkT
        },{
          key: '总产量',
          value: `${data.MCNT.quantity}${data.MCNT.unit}`
        },{
          key: '总工作站节拍',
          value: ''
        },{
          key: '线体工时',
          value: ''
        },{
          key: '喷釉工时',
          value: ''
        },{
          key: '打磨工时',
          value: ''
        }

        // {
        //   key: '线体停机时间',
        //   value: ''
        // },{
        //   key: '喷釉停机时间',
        //   value: ''
        // },{
        //   key: '打磨停机时间',
        //   value: ''
        // }
      ]

      this.TotalTime = data.WorkTNum.quantity; 

      if(data.ONOFF === '0') {
        this.dataLine[1].value = '停机'
      } else {
        this.dataLine[1].value = '生产'
      }
      this.scadaService.getSupervision().subscribe(data2 => {
        let v=0;
        v = this.TotalTime - data2.LinStpTNum.quantity;
        this.dataLine[5].value = parseInt((v/(24*60*60)).toString()) + '天' + parseInt(((v%(24*60*60))/3600).toString()) + '时' + 
          parseInt((((v%(24*60*60))%3600)/60).toString()) + '分' + (((v%(24*60*60))%3600)%60).toString() + '秒';
      //  this.dataLine[3].value = data2.LinStpTime;
        v = this.TotalTime - data2.SprStpTNum.quantity;
        this.dataLine[6].value = parseInt((v/(24*60*60)).toString()) + '天' + parseInt(((v%(24*60*60))/3600).toString()) + '时' + 
          parseInt((((v%(24*60*60))%3600)/60).toString()) + '分' + (((v%(24*60*60))%3600)%60).toString() + '秒';
      //  this.dataLine[4].value = data2.SprStpTime;
        v = this.TotalTime - data2.PolStpTNum.quantity;
        this.dataLine[7].value = parseInt((v/(24*60*60)).toString()) + '天' + parseInt(((v%(24*60*60))/3600).toString()) + '时' + 
          parseInt((((v%(24*60*60))%3600)/60).toString()) + '分' + (((v%(24*60*60))%3600)%60).toString() + '秒';   
          //     this.dataLine[5].value = data2.PolStpTime;
         
      })

      this.scadaService.getPeriod().subscribe(dataJP =>{
        if(dataJP){
          this.dataLine[4].value = `${dataJP.CT.quantity}${dataJP.CT.unit}`
        }
      })
      this.data = this.dataLine;
    })  

    //   this.data = this.dataLine.concat(this.dataJP);
    
  }



  ngOnDestroy() {
    this.alive = false;
  };

  

}
