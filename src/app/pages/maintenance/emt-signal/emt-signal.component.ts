import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, IDCmpFn, TableSettings } from '../../../@core/data/util.service';
import { ScadaDataService } from '../../../@core/data/scadaData.service';
import * as moment from 'moment';

@Component({
  selector: 'mes-emt-signal',
  templateUrl: './emt-signal.component.html',
  styleUrls: ['./emt-signal.component.scss']
})
export class EmtSignalComponent implements OnInit, AfterViewInit {
  settings = { ...TableSettings.basic };
  source: LocalDataSource = new LocalDataSource();
  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
    this.settings.actions.delete =false;


    this.settings.columns = {
      equipment: {
        title: '设备',
        type: 'string',
        // valuePrepareFunction: (equipment, row) => {
        //   return row.equipment ? `${row.equipment.oid} [${row.equipment.name}]` : '';
        // },
        // filterFunction: (value, search) => {
        //   return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
        //   (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        // }
      },
      PA: {
        title: '备品备件',
        type: 'string',
        // valuePrepareFunction: (PA, row) => {
        //   return row.PA ? `${row.PA.oid} [${row.PA.name}]` : '';
        // },
        // filterFunction: (value, search) => {
        //   return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
        //   (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        // }
      },
      hs: {
        title: '层级结构',
        type: 'string',
        // valuePrepareFunction: (hs, row) => {
        //   return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        // },
        // filterFunction: (value, search) => {
        //   return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
        //     (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        // }
      },
      op: {
        title: '操作',
        type: 'string',
      },
      nextTime:{
        title: '下次操作时间',
        type: 'string',
      },
      lastTime:{
        title: '上次操作时间',
        type: 'string',
        valuePrepareFunction: (lastTime, row) => {
          return row.lastTime ? moment(row.lastTime).format('YYYY-MM-DD') : '';
        },
      },
      MinPeriod: {
        title: '最小周期',
        type: 'string',
        valuePrepareFunction: (MinPeriod, row) => {
          return row.MinPeriod ? `${row.MinPeriod.quantity}${row.MinPeriod.unit}` : '';
        },
        filterFunction: (value, search) => {
          return value.quantity && value.unit && `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
        },
      },
      MaxPeriod: {
        title: '最大周期',
        type: 'string',
        valuePrepareFunction: (MaxPeriod, row) => {
          return row.MaxPeriod ? `${row.MaxPeriod.quantity}${row.MaxPeriod.unit}` : '';
        },
        filterFunction: (value, search) => {
          return value.quantity && value.unit && `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
        },
      },
    };
  }

  data: any[];

  constructor(private scadaService: ScadaDataService) {
    this.initSetting();
    this.init();
  }

  ngAfterViewInit() {
    // setInterval(() => {
    //   this.init();
    // }, 10 * 60  * 1000);  //10分钟更新一次
  }

  ngOnInit() {

  }

  init () {
    this.scadaService.getMaintenacePara().subscribe(MPdata =>{
      console.log(MPdata);
      this.data = [
      {'equipment': 'PYRob1-[喷釉机器人1#]','PA': 'PQZ0-[喷枪针]','hs': '喷釉线[ProductionLine]','op':'更换',
       'nextTime': '','lastTime': MPdata.RepNdl.time, MinPeriod: {quantity: 3, unit: '月'}, MaxPeriod: {quantity: 5, unit: '月'}},
      {'equipment': 'PYRob1-[喷釉机器人1#]','PA': 'CDHM-[擦底海绵]','hs': '喷釉线[ProductionLine]','op':'更换',
       'nextTime': '','lastTime': MPdata.RepSpg.time, MinPeriod: {quantity: 2, unit: '月'}, MaxPeriod: {quantity: 2, unit: '月'}},
      {'equipment': 'PYRob1-[喷釉机器人1#]','PA': 'CCJC-[除尘集尘装置]','hs': '喷釉线[ProductionLine]', 'op':'清理',
       'nextTime': '','lastTime': MPdata.ClcT.time, MinPeriod: {quantity: 15, unit: '天'}, MaxPeriod: {quantity: 15, unit: '天'}},
      {'equipment': 'PYRob1-[喷釉机器人1#]','PA': 'GLW0-[水帘柜除釉过滤网]','hs': '喷釉线[ProductionLine]', 'op':'清理',
       'nextTime': '','lastTime': MPdata.FilT.time, MinPeriod: {quantity: 15, unit: '天'}, MaxPeriod: {quantity: 15, unit: '天'}},
      {'equipment': 'DMRob1-[打磨机器人1#]','PA': 'HLFL-[恒力]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot1T.time, MinPeriod: {quantity: 15, unit: '天'}, MaxPeriod: {quantity: 15, unit: '天'}},
      {'equipment': 'DMRob2-[打磨机器人2#]','PA': 'HLFL-[恒力]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot2T.time, MinPeriod: {quantity: 15, unit: '天'}, MaxPeriod: {quantity: 15, unit: '天'}},
      {'equipment': 'DMRob3-[打磨机器人3#]','PA': 'HLFL-[恒力]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot3T.time, MinPeriod: {quantity: 15, unit: '天'}, MaxPeriod: {quantity: 15, unit: '天'}},
      {'equipment': 'DMRob1-[打磨机器人1#]','PA': 'DMJ0-[打磨机]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot1S.time, MinPeriod: {quantity: 7, unit: '天'}, MaxPeriod: {quantity: 7, unit: '天'}},
      {'equipment': 'DMRob2-[打磨机器人2#]','PA': 'DMJ0-[打磨机]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot2S.time, MinPeriod: {quantity: 7, unit: '天'}, MaxPeriod: {quantity: 7, unit: '天'}},
      {'equipment': 'DMRob3-[打磨机器人3#]','PA': 'DMJ0-[打磨机]','hs': '打磨线[ProductionLine]', 'op':'维护',
       'nextTime': '','lastTime': MPdata.Rot3S.time, MinPeriod: {quantity: 7, unit: '天'}, MaxPeriod: {quantity: 7, unit: '天'}},
      {'equipment': 'DMRob1-[打磨机器人1#]','PA': 'ML00-[磨料]','hs': '打磨线[ProductionLine]', 'op':'更换',
       'nextTime': '','lastTime': MPdata.Rot1G.time, MinPeriod: {quantity: 1, unit: '小时'}, MaxPeriod: {quantity: 1, unit: '小时'}},
      {'equipment': 'DMRob2-[打磨机器人2#]','PA': 'ML00-[磨料]','hs': '打磨线[ProductionLine]', 'op':'更换',
       'nextTime': '','lastTime': MPdata.Rot2G.time, MinPeriod: {quantity: 1, unit: '小时'}, MaxPeriod: {quantity: 1, unit: '小时'}},
      {'equipment': 'DMRob3-[打磨机器人3#]','PA': 'ML00-[磨料]','hs': '打磨线[ProductionLine]', 'op':'更换',
       'nextTime': '','lastTime': MPdata.Rot3G.time, MinPeriod: {quantity: 1, unit: '小时'}, MaxPeriod: {quantity: 1, unit: '小时'}},
      ]
      for(let i=0; i<this.data.length; i++) {
        let T = this.data[i];
        if(T.MinPeriod.quantity === T.MaxPeriod.quantity && T.MinPeriod.unit === T.MaxPeriod.unit) {
          if(T.MinPeriod.unit === '月') {
            T.nextTime = this.addMonth(T.lastTime, T.MinPeriod.quantity)
          } else if (T.MinPeriod.unit === '天') {
            T.nextTime = this.addDate(T.lastTime, T.MinPeriod.quantity)
          } else if (T.MinPeriod.unit === '小时') {
            T.nextTime = this.addHours(T.lastTime, T.MinPeriod.quantity)
          }
        } else if (T.MinPeriod.quantity != T.MaxPeriod.quantity || T.MinPeriod.unit != T.MaxPeriod.unit) {
          if(T.MinPeriod.unit === '月') {
            T.nextTime = this.addMonth(T.lastTime, T.MinPeriod.quantity);
            console.log('T.Ndate1',T.nextTime);

            T.nextTime = T.nextTime + '——' + this.addMonth(T.lastTime, T.MaxPeriod.quantity)
            console.log('T.Ndate2',T.nextTime);
          } else if (T.MinPeriod.unit === '天') {
            T.nextTime = this.addDate(T.lastTime, T.MinPeriod.quantity);
            T.nextTime = T.nextTime + '——' + this.addDate(T.lastTime, T.MaxPeriod.quantity)
          } else if (T.MinPeriod.unit === '小时') {
            T.nextTime = this.addHours(T.lastTime, T.MinPeriod.quantity);
            T.nextTime = T.nextTime + '——' + this.addHours(T.lastTime, T.MaxPeriod.quantity)
          };
        }
      }
    })
  }

  //日期加减函数：其中，date参数是要进行加减的日期，
  //days参数是要加减的天数，如果往前算就传入负数，往后算就传入正数
  addDate(date,days): string {
    var d=new Date(date);
    d.setDate(d.getDate() + days);
    var m=d.getMonth()+1;
    return d.getFullYear()+'-'+m+'-'+d.getDate();
  }

  //月份加减函数：其中，date参数是要进行加减的日期，
  //months 参数是要加减的月数，如果往前算就传入负数，往后算就传入正数
  addMonth(date,months): string {
    var d=new Date(date);
    d.setMonth(d.getMonth() + months);
    var m=d.getMonth()+1;
    return d.getFullYear()+'-'+m+'-'+d.getDate();
  }

  //小时加减函数：其中，date参数是要进行加减的日期，
  //hours 参数是要加减的小时数，如果往前算就传入负数，往后算就传入正数
  addHours(date,hours): string {
    var d=new Date(date);
    d.setHours(d.getHours() + hours);
    var m=d.getMonth()+1;
    return d.getFullYear()+'-'+m+'-'+d.getDate() +' '+ d.getHours() + ':' + d.getMinutes() +':' + d.getSeconds();
  }

}
