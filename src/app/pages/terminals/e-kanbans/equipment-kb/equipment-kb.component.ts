import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScadaDataService } from '../../../../@core/data/scadaData.service';
import { IQuantity, Quantity} from '../../../../@core/model/common';

@Component({
  selector: 'mes-equipment-kb',
  templateUrl: './equipment-kb.component.html',
  styleUrls: ['./equipment-kb.component.scss']
})
export class EquipmentKbComponent implements OnInit, AfterViewInit {

  //images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  Total: IQuantity;  //总产量
  TotalTime : number;  //总工时 
  TotalJP: number;   //总工作站节拍

  dataOEE: number ;   //整线OEE


  constructor(private scadaService: ScadaDataService) {
    this.init();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.init();
    }, 10 * 1000);
  }

  init() {
    this.scadaService.getProductionLine().subscribe(data => {
      this.scadaService.getPeriod().subscribe(dataJP =>{
        if(data){
          this.Total = data.MCNT;  
          this.TotalTime = data.WorkTNum.quantity; 
        }

        if(dataJP){
          this.TotalJP = dataJP.CT.quantity;
        }

        if( this.TotalTime === 0 || this.TotalJP === 0 ) {
          this.dataOEE = 0;
          console.log('0');
        } else {
          // OEE = 合格数量/理论产量
          this.dataOEE = (this.Total.quantity/(this.TotalTime/this.TotalJP)) * 100;
          console.log('1');
        }
      })
    }); 
  }
}

    // this.scadaService.getSupervision().subscribe(dataS => {
    
    //   this.dataPY = [
    //     {
    //       key: '釉料利用率',
    //       value: dataS.GlaUse
    //     },{
    //       key: '釉料回收率',
    //       value: dataS.GlaRec
    //     },{
    //       key: '供釉压力',
    //       value: dataS.GlaPre
    //     },{
    //       key: '釉料罐液位',
    //       value: dataS.GlaLev
    //     },{
    //       key: '气源总压力',
    //       value: dataS.AirPre
    //     },{
    //       key: '喷枪开关气压',
    //       value: dataS.AirPreS
    //     },{
    //       key: '供釉量',
    //       value: dataS.GlaAmo
    //     },{
    //       key: '釉料流速',
    //       value: dataS.GlaSpd
    //     }
    //   ]

    //   this.dataEn =[
    //     {
    //       key: '喷釉房电量',
    //       value: `${dataS.PwrUse.quantity}${dataS.PwrUse.unit}`
    //     },{
    //       key: '喷釉房用水量',
    //       value: `${dataS.WatUse.quantity}${dataS.WatUse.unit}`
    //     }
    //   ]

    //   // this.dataTime = [
    //   //   {
    //   //     key: '喷釉转台上升下降周期时间',
    //   //     value: `${dataS.StaT.quantity}${dataS.StaT.unit}`
    //   //   }, {
    //   //     key: '打磨大转台转一工位时间',
    //   //     value: `${dataS.BStgT.quantity}${dataS.BStgT.unit}`
    //   //   }, {
    //   //     key: '1#打磨小转台上升时间',
    //   //     value: `${dataS.Stg1Up.quantity}${dataS.Stg1Up.unit}`
    //   //   }, {
    //   //     key: '1#打磨小转台下降时间',
    //   //     value: `${dataS.Stg1Drop.quantity}${dataS.Stg1Drop.unit}`
    //   //   }, {
    //   //     key: '2#打磨小转台上升时间',
    //   //     value: `${dataS.Stg2Up.quantity}${dataS.Stg2Up.unit}`
    //   //   }, {
    //   //     key: '2#打磨小转台下降时间',
    //   //     value: `${dataS.Stg2Drop.quantity}${dataS.Stg2Drop.unit}`
    //   //   }, {
    //   //     key: '3#打磨小转台上升时间',
    //   //     value: `${dataS.Stg3Up.quantity}${dataS.Stg3Up.unit}`
    //   //   }, {
    //   //     key: '3#打磨小转台下降时间',
    //   //     value: `${dataS.Stg3Drop.quantity}${dataS.Stg3Drop.unit}`
    //   //   }
    //   //   // , {
    //   //   //   key: '线体停机时间',
    //   //   //   value: dataS.LinStpTime
    //   //   // },{
    //   //   //   key: '喷釉停机时间',
    //   //   //   value: dataS.SprStpTime
    //   //   // },{
    //   //   //   key: '打磨停机时间',
    //   //   //   value: dataS.PolStpTime
    //   //   // }

    //   // ]
    // })







