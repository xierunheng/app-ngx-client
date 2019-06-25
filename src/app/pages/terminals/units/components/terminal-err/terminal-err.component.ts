import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { UtilData } from '../../../../../@core/data/util.service';
import { Terminal, IBodyOp } from '../../../../../@core/model/terminal';

@Component({
  selector: 'mes-terminal-err',
  templateUrl: './terminal-err.component.html',
  styleUrls: ['./terminal-err.component.scss']
})
export class TerminalErrComponent implements OnInit, OnDestroy {
  @Input() model: Terminal;
  @Input()
  set oid(value) {
    this.play();
  }
  @Input() tState: string;
  @Input() player: HTMLAudioElement;
  @Output() tStateChange = new EventEmitter<any>();


  trackUrl: string = 'assets/audio/alert2.mp3';

  constructor() {
  }

  ngOnInit() {
    console.log(this.model);
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

  onErrCancel() {
    this.tStateChange.emit(UtilData.terminalStates[0]);
  }

  ngOnDestroy() {
    // if (this.player) {
    //   this.player.pause();
    //   this.player.src = '';
    //   this.player.load();
    // }
  }
}
