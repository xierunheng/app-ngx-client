import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import { GlobalData } from '../../../../@core/model/global';

import { IUser } from '../../../../@core/model/user';
import { UtilData, MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IParameter } from '../../../../@core/model/parameter';
import { MsubLot, IMsubLot, IMsubLotProfile } from '../../../../@core/model/msublot';
import { IMOpLog } from '../../../../@core/model/base/oplog';
import { Terminal, IBodyOp, IBodyRecord } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { ForcemodalComponent } from './forcemodal/forcemodal.component';

@Component({
  selector: 'mes-terminal-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  @ViewChild('codeInput') codeInput: ElementRef;

  //是否翻页
  flipped = false;
  //当前登陆的用户
  user: IUser;

  //当前登陆的工序所执行的坯体操作
  bodyOp: IBodyOp;

  //终端生产操作 model
  model: Terminal;

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  reasons: IParameter[];

  //条码录入的方式，目前有‘扫码', '手动' 两种
  inputType: string = '扫码';

  //可选的录入类型
  inputTypes = {
    scan: {
      text: '扫码',
    },
    hand: {
      text: '手动',
    },
  };

  //数组，方便 html 使用
  inputTypesArr = _.values(this.inputTypes);

  //上一次扫码的操作记录
  lastBodies: IBodyRecord[] = [];

  //扫码枪的扫码内容
  strBody: string;

  valueBuffer: string = '';

  //装配统计项
  assCount: any;
  //包材的物料子批次列表
  cartonSubLot: any[];

  /**
   * [新扫的条码坯体是否为样品]
   * @return {boolean} [description]
   */
  get isSample(): boolean {
    return this.model && this.model.msublot && this.model.msublot.mdef.code === 'SAMP';
  }

  @HostListener('document:keypress', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    const char = String.fromCharCode(e.which);
    if (char === '\r' || char === '\n' || char === '\r\n') {
      if (this.codeInput) {
        this.codeInput.nativeElement.focus();
      }
      if (this.inputType === this.inputTypes.scan.text && this.valueBuffer) {

        this.strBody = this.valueBuffer;
        this.doTrack(this.strBody);
        this.valueBuffer = '';
      } else if (this.inputType === this.inputTypes.hand.text && this.strBody) {
        this.doTrack(this.strBody);
      }
    } else {
      this.valueBuffer += char;
    }
  }

  constructor(private service: MsubLotService,
    private modalService: NgbModal) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.bodyOp = MaterialData.BodyOps[this.user.op];
  }

  ngOnInit() {
    this.reasons = GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[21]));
    this.reload();
  }

  reload(): void {
    this.strBody = '';
    this.valueBuffer = '';
    this.model = Terminal.create(this.user);
  }

  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
  onInputTypeChange(event) {
    event.srcElement.blur();
    this.reload();
  }

  /**
   * [执行操作]
   * @param {IMOpLog} oplog [description]
   */
  onOp(oplog: IMOpLog) {
    console.log(oplog);
    const modal = this.modalService.open(ForcemodalComponent, { size: 'sm', backdrop: 'static', container: 'nb-layout' });
    modal.componentInstance.oplog = oplog;
    modal.componentInstance.isSample = this.isSample;
    modal.result.then((result: IMOpLog) => {
      if (result.op === 'SAMP') {
        this.model.msublot.mdef.code = result.op;
        this.service.updateMdef(this.model.msublot._id, this.model.msublot.mdef).subscribe(() => {
        });
      } else {
        result.reason[0].value = {
          valueStr: this.user.person.oid,
          unit: this.user.person._id
        };
        this.model.oplog = result;
        this.doOP();
      }
    }, (reason) => {
      // console.log(reason);
      return;
    });
  }

  doOP() {
    this.service.op(this.model).subscribe(item => {
      this.model.reinit(this.bodyOp.text);
      this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
      if (this.tState === UtilData.terminalStates[0]) {
        this.lastBodies.push({
          str: item.oid,
          date: new Date()
        });
        this.doTrack(item.oid);

      }
    });
  }

  /**
   * [执行查询操作]
   * @param {string} oid [description]
   */
  doTrack(oid: string): void {
    if (oid) {
      this.model.msublot = undefined;
      this.cartonSubLot = undefined;
      this.service.getMsubLotAssDetailByOid(oid).subscribe(item => {
        this.model.msublot = item;
        this.assCount = _.countBy(item.assSubLot, 'mdef.oid');
        if (oid.startsWith('99')) {
          this.cartonSubLot = item.assSubLot.filter(ass => ass.oid.startsWith('98'));
        } else if (oid.startsWith('98')) {
          this.cartonSubLot = [item];
        }
        if (this.cartonSubLot && this.cartonSubLot.length > 0) {
          this.cartonSubLot.forEach(carton => {
            carton.assSubLot = carton.assSubLot.map(cartonAss => {
              cartonAss = item.assSubLot.find(ass => ass.oid === cartonAss.oid);
              return cartonAss;
            })
          })
        }
      },
        error => {
          window.alert('条码错误');
        }
      )
    }
    // setTimeout(function() {
    //   $("#focus").focus();
    // }, 1000)

  }

  flipClick(event) {
    this.flipped = !this.flipped;
  }
}
