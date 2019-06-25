import { Component, OnInit, Input} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MaterialData } from '../../../@core/data/util.service';
import { IMOpLog } from '../../../@core/model/base/oplog';
import { OplogComponent } from '../oplog/oplog.component';
class MaterialState {
  state: string;
  op: string;
  stateClass: string;
  oplog: IMOpLog;
  stateTips: string;

  constructor(bodyOp: any) {
    this.state = bodyOp.state;
    this.op = bodyOp.text;
    this.stateClass = '';
    this.stateTips = '';
  }
}

@Component({
  selector: 'mes-process-bar',
  templateUrl: './process-bar.component.html',
  styleUrls: ['./process-bar.component.scss']
})
export class ProcessBarComponent implements OnInit {
  oplogComponent = OplogComponent;

  @Input()
  set ops(ops: IMOpLog[]) {
    for (let i = 0; i < this.states.length; i++) {
      this.states[i].oplog = ops.find(o => o.op === this.states[i].op);
      if (this.states[i].oplog) {
        this.states[i].stateClass = 'active';
        this.states[i].stateTips = '进行中';
        if (i > 0) {
          if(this.states[i - 1] && this.states[i-1].oplog) {
            this.states[i - 1].stateClass = 'visited';
            this.states[i - 1].stateTips = moment(this.states[i - 1].oplog.date).format("MM-DD");
          }
        }
      }
    }
    if (_.last(ops).op === MaterialData.BodyOps.scrap.text) {
      let state = this.states.find(s => s.stateClass === 'active');
      if (state) {
        state.stateClass = 'error';
        state.stateTips = '报废';
      }
    }
    console.log(this.states);

  }

  states: MaterialState[] = [
    new MaterialState(MaterialData.BodyOps.create),
    new MaterialState(MaterialData.BodyOps.mold),
    new MaterialState(MaterialData.BodyOps.dry),
    new MaterialState(MaterialData.BodyOps.trim),
    new MaterialState(MaterialData.BodyOps.glaze),
    new MaterialState(MaterialData.BodyOps.grind),
    new MaterialState(MaterialData.BodyOps.load),
    new MaterialState(MaterialData.BodyOps.fire),
    new MaterialState(MaterialData.BodyOps.qc),
    new MaterialState(MaterialData.BodyOps.pqc),
    new MaterialState(MaterialData.BodyOps.pack),
  ];

  constructor() { }

  ngOnInit() {
    console.log(this.oplogComponent);
  }

}
