import { Component, OnInit } from '@angular/core';
import { MsubLotService } from '../../../../@core/data/msublot.service';

@Component({
  selector: 'mes-president-kb',
  templateUrl: './president-kb.component.html',
  styleUrls: ['./president-kb.component.scss']
})
export class PresidentKbComponent implements OnInit {

  //统计开始时间
  startTime: Date = new Date('2019-03-21');
  //统计结束时间
  endTime: Date = new Date('2019-03-22');

  qcData: any[];
  reasonData: any[];

  constructor(private mslService: MsubLotService) { }

  ngOnInit() {
    // let query = {};
    // let groups: string[] = ['qcState', 'molder', 'mdef', 'qcTime'];
    // this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), groups, query)
    //   .subscribe(items => {
    //    if (items.length > 0)
    //      {this.qcData = items;};
    //     //this.calcQcs(items);
    //   });
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
        console.log(items);
       if (items.length > 0)
         {this.reasonData = items;};
      });
  }

}
