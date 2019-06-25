import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { IMOpLog } from '../../../@core/model/base/oplog';
import { MaterialData } from '../../../@core/data/util.service';

@Component({
  selector: 'mes-oplog',
  templateUrl: './oplog.component.html',
  styleUrls: ['./oplog.component.scss']
})
export class OplogComponent implements OnInit {
  //ol for oplog
  @Input() oplog:IMOpLog;
  @Input() isCollapsed: boolean = false;

  @Output() defect = new EventEmitter<IMOpLog>();
  @Output() scrap = new EventEmitter<IMOpLog>();

  //是否翻页
  flipped = false;

  //card 默认大小
  size: string = 'xsmall';
  //card 默认状态
  status: string = 'success';
  //card 默认强调
  accent: string = '';

  constructor() { }

  ngOnInit() {
    console.log(this.oplog);
    switch (this.oplog.op) {
      case MaterialData.BodyOps.create.text:
      case MaterialData.BodyOps.dry.text:
      case MaterialData.BodyOps.fire.text:
        this.size = 'xxsmall';
        break;
      case MaterialData.BodyOps.mold.text:
      case MaterialData.BodyOps.trim.text:
      case MaterialData.BodyOps.glaze.text:
      case MaterialData.BodyOps.grind.text:
      case MaterialData.BodyOps.load.text:
        this.accent = 'primary';
        break;
      case MaterialData.BodyOps.scrap.text:
        this.status = 'danger';
        break;
      case MaterialData.BodyOps.pass.text:
      case MaterialData.BodyOps.reject.text:
      case MaterialData.BodyOps.undo.text:
        this.status = 'warning';
        break;
      
      default:
        // code...
        break;
    }
  }

  //点击 本工序缺陷
  defectIt(): void {
    if(window.confirm(`强制归类为[${MaterialData.BodyOps[this.oplog.op].name}]工序缺陷，是否继续?`)) {
      this.defect.emit(this.oplog);
    }
  }

  //点击 本工序报废
  scrapIt(): void {
    if(window.confirm(`强制归类为[${MaterialData.BodyOps[this.oplog.op].name}]工序报废，是否继续?`)) {
      this.scrap.emit(this.oplog);
    }
  }

  /**
   * [当用户点击翻页按钮]
   */
  flipClick() {
    if(this.accent) {
      this.flipped = !this.flipped;
    }
  }
}
