import { Component, OnInit } from '@angular/core';
import { ScadaDataService } from '../../../../@core/data/scadaData.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'ngx-equipmgt-kb',
  templateUrl: './equipmgt-kb.component.html',
  styleUrls: ['./equipmgt-kb.component.scss']
})
export class EquipmgtKbComponent implements OnInit {

  data:any[];
  paras: any[];
  energyUse:any[];
  materialUse:any[];
  dataLine: any[];

  constructor(private scadaService: ScadaDataService) { }

  ngOnInit() {
      this.init()

  }

  init():void{
      

      this.scadaService.getSupervision().subscribe(data => {
      console.log('data',data);
      // this.paras = _.values(data).filter(item => item.name !== undefined);
      // console.log('paras', this.paras);
      this.energyUse=[
      {
          key:"釉料利用率",
          value:`${data.GlaUse.value.quantity}${data.GlaUse.value.unit}`
      },{
          key:"釉料回收率",
          value:`${data.GlaRec.value.quantity}${data.GlaRec.value.unit}`
      },{
          key:"喷釉房用水量",
          value:`${data.WatUse.value.quantity}${data.WatUse.value.unit}`
      },{
          key:"喷釉房电量",
          value:`${data.PwrUse.value.quantity}${data.PwrUse.value.unit}`
      }
      ]

      this.scadaService.getProductionLine().subscribe(data => {
          console.log(data);
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
            },
            // ,{
            //   key: '线体工时',
            //   value: ''
            // },{
            //   key: '喷釉工时',
            //   value: ''
            // },{
            //   key: '打磨工时',
            //   value: ''
            // },
            {
              key: '线体停机时间',
              value: ''
            },{
              key: '喷釉停机时间',
              value: ''
            },{
              key: '打磨停机时间',
              value: ''
            }
          ]
          if(data.ONOFF === '0') {
            this.dataLine[1].value = '停机'
          } else {
            this.dataLine[1].value = '生产'
          }
          this.scadaService.getSupervision().subscribe(data2 => {
            this.dataLine[3].value = data2.LinStpTime;
            this.dataLine[4].value = data2.SprStpTime;
            this.dataLine[5].value = data2.PolStpTime;
            this.data = this.dataLine.concat(this.energyUse) 
          })

      })

      
    })
  }

}
