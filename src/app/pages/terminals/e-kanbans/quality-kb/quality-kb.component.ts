import { Component, OnInit } from '@angular/core';
import { KbTitleComponent }  from '../components/kb-title/kb-title.component'
import { MsubLotService } from '../../../../@core/data/msublot.service';

@Component({
  selector: 'mes-quality-kb',
  templateUrl: './quality-kb.component.html',
  styleUrls: ['./quality-kb.component.scss']
})
export class QualityKbComponent implements OnInit {

	images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

  //统计开始时间
  startTime: Date = new Date('2019-03-21');
  //统计结束时间
  endTime: Date = new Date('2019-03-22');

  qcData: any[];
  reasonData: any[];

  constructor(private mslService: MsubLotService) { }

  ngOnInit() {
    //this.qcData = [];
    //this.reasonData = [];
    let query = {};
    let groups: string[] = ['qcState', 'molder', 'mdef', 'qcTime'];
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), groups, query)
      .subscribe(items => {
       if (items.length > 0)
         {this.qcData = items;};
        //this.calcQcs(items);
      });
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
        console.log(items);
       if (items.length > 0)
         {this.reasonData = items;};
      });
  }

}
