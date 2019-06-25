import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { GlobalData } from '../../../../../@core/model/global';
import { IHierarchyScope } from '../../../../../@core/model/hs';
import { UtilData, MaterialData, WorkData } from '../../../../../@core/data/util.service';
import { Terminal } from '../../../../../@core/model/terminal';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

@Component({
  selector: 'mes-terminal-scrap',
  templateUrl: './terminal-scrap.component.html',
  styleUrls: ['./terminal-scrap.component.scss']
})
export class TerminalScrapComponent implements OnInit {
  @Input() model: Terminal;
  @Input() op: string;
  @Input() player: HTMLAudioElement;

  @Input()
  set oid(value) {
    this.play();
  }

  @Input() tState: string;
  @Output() tStateChange = new EventEmitter<any>();

  trackUrl: string = 'assets/audio/alert1.mp3';

  constructor(private service: MsubLotService) { }

  ngOnInit() {
    this.play();
  }

  /**
   * [播放报警音]
   */
  play(): void {
    if (this.player) {
      if (this.player.src !== this.trackUrl) {
        this.player.src = this.trackUrl;
        this.player.load();
      }
      this.player.play();
    }
  }

  onSCSubmit() {
    this.model.reinit(MaterialData.BodyOps.scrap.text);
    console.log(this.model);
    this.service.op(this.model.getElite(this.op))
      .subscribe(item => {
        this.model.reinit(this.op);
        this.tStateChange.emit(UtilData.terminalStates[0]);
      })
  }

  // /**
  //  * [成型工拿回去修]
  //  */
  // onSCRenew() {
  //   this.model.reinit(MaterialData.BodyOps.renew.text);
  //   this.service.op(this.model.getElite(this.op))
  //     .subscribe(item => {
  //       console.log(this.op);
  //       this.model.reinit(this.op);
  //       this.tStateChange.emit(UtilData.terminalStates[0]);
  //     })
  // }

  /**
   * [修理工拿过去修]
   */
  onSCRepair() {
    if(this.model.msublot.repairType) {
      this.model.reinit(MaterialData.BodyOps.repair.text);
    } else {
      this.model.reinit(MaterialData.BodyOps.renew.text);
    }
    this.service.op(this.model.getElite(this.op))
      .subscribe(item => {
        console.log(this.op);
        this.model.reinit(this.op);
        this.tStateChange.emit(UtilData.terminalStates[0]);
      })
  }

  onSCCancel() {
    this.tStateChange.emit(UtilData.terminalStates[0]);
  }

}
