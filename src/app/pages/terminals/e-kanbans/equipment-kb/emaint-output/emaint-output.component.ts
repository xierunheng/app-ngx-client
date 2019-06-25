import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';
import { SingleEventService } from '../../../../../@core/data/single-event.service';
import { ISingleEvent, IAlarmData} from '../../../../../@core/model/single-event';
import { ScadaDataService } from '../../../../../@core/data/scadaData.service';

@Component({
  selector: 'ngx-emaint-output',
  templateUrl: './emaint-output.component.html',
  styleUrls: ['../equipment-kb.component.scss','./emaint-output.component.scss']
})
export class EmaintOutputComponent implements OnInit, AfterViewInit {
 dataJS: any[];
 dataJP: any[];
 data:any[];

  private alive = true;

  currentTheme: string;

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;

  paras: any[];


  constructor(private themeService: NbThemeService,
              private seService: SingleEventService,
              private scadaService: ScadaDataService,
              private breakpointService: NbMediaBreakpointsService) {
    // this.breakpoints = this.breakpointService.getBreakpointsMap();
    // this.themeService.onMediaQueryChange()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(([oldValue, newValue]) => {
    //     this.breakpoint = newValue;
    //   });

    // this.themeService.getJsTheme().pipe(takeWhile(() => this.alive))
    //   .subscribe(theme => {
    //     this.currentTheme = theme.name;
    // });
    this.init();
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.init();
    }, 1 * 60  * 1000);  //1分钟更新一次
  }

  ngOnInit() {
   // this.init();
  }

  init(): void {

    this.scadaService.getCountData().subscribe(dataCD => {
      if(dataCD){
        this.dataJS = [
          {
            key: '打磨产量',
            value: `${dataCD.PolCNT.quantity}${dataCD.PolCNT.unit}`
          },{
            key: '打磨不合格',
            value: `${dataCD.PolFal.quantity}${dataCD.PolFal.unit}`
          },{
            key: '喷釉产量',
            value: `${dataCD.PCNT.quantity}${dataCD.PCNT.unit}`
          },{
            key: '马桶A喷涂遍数',
            value: `${dataCD.PACNT.quantity}${dataCD.PACNT.unit}`
          },{
            key: '马桶B喷涂遍数',
            value: `${dataCD.PBCNT.quantity}${dataCD.PBCNT.unit}`
          },
        ]
      }
      this.data =this.dataJS;
    })

    // this.scadaService.getPeriod().subscribe(dataJP =>{
    //   console.log('节拍', dataJP);
    //   if(dataJP){
    //     this.dataJP = [
    //       {
    //         key: '总工作站节拍',
    //         value: `${dataJP.CT.quantity}${dataJP.CT.unit}`
    //       },
    //       // {
    //       //   key: '喷釉节拍',
    //       //   value: `${dataJP.SprT.quantity}${dataJP.SprT.unit}`
    //       // },
    //       // {
    //       //   key: '喷涂节拍',
    //       //   value: `${dataJP.StgCT.quantity}${dataJP.StgCT.unit}`
    //       // },
    //       // {
    //       //   key: '1#打磨节拍',
    //       //   value: `${dataJP.Pol1CT.quantity}${dataJP.Pol1CT.unit}`
    //       // },{
    //       //   key: '2#打磨节拍',
    //       //   value: `${dataJP.Pol2CT.quantity}${dataJP.Pol2CT.unit}`
    //       // },{
    //       //   key: '3#打磨节拍',
    //       //   value: `${dataJP.Pol3CT.quantity}${dataJP.Pol3CT.unit}`
    //       // }
    //     ]
    //   }
      
    // this.data =this.dataJP;
    // //  this.data =this.dataJP.concat(this.dataJS);
    // //  console.log('this.dataJP', this.dataJP);
    // })
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
