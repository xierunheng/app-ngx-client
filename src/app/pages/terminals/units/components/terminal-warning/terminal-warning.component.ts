import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { GlobalData } from '../../../../../@core/model/global';
import { TreeviewItem } from 'ngx-treeview';
import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';
import { Terminal, IBodyOp } from '../../../../../@core/model/terminal';
import { IEquipment } from '../../../../../@core/model/equipment';
import { IMdefElite } from '../../../../../@core/model/mdef';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

@Component({
	selector: 'mes-terminal-warning',
	templateUrl: './terminal-warning.component.html',
	styleUrls: ['./terminal-warning.component.scss']
})
export class TerminalWarningComponent implements OnInit {
	@Input() model: Terminal;
	@Input() op: string;
	@Input()
	set oid(value) {
		this.play();
	}
	@Input() tState: string;
	@Input() player: HTMLAudioElement;
	@Input() kilns: IEquipment[];
	@Input() mtree: TreeviewItem[]; 
	@Input() lastMdef: IMdefElite;
	@Output() tStateChange = new EventEmitter<any>();

	trackUrl: string = 'assets/audio/alert1.mp3';

  idCmpFn = IDCmpFn;

	constructor(private service: MsubLotService) { }

	ngOnInit() {
		if(this.model && this.lastMdef) {
			this.model.msublot.mdef = this.lastMdef;
		}
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

	onMdefChange(event): void {
		this.model.msublot.mclass = [this.mtree[0].value];

	}

	onSubmit() {
		//有警告的，窑炉登窑时间肯定时没有的
		this.model.msublot.kilnTime = undefined;
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
