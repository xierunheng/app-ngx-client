import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import * as _ from 'lodash';
import { GlobalData } from '../../../../../@core/model/global';
import { UtilData, MaterialData, WorkData } from '../../../../../@core/data/util.service';
import { IParameter } from '../../../../../@core/model/parameter';
import { Terminal, IBodyOp } from '../../../../../@core/model/terminal';
import { MsubLotService } from '../../../../../@core/data/msublot.service';
// import { ImgUploadComponent } from '../../../modals/img-upload/img-upload.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from '../../../../../@core/data/upload.service';

class ImageContent {
  public name: string;
  public src: string;
  constructor(name: string, src: string) {
    this.name = name;
    this.src = src;
  }
}

@Component({
  selector: 'mes-terminal-qc',
  templateUrl: './terminal-qc.component.html',
  styleUrls: ['../../pda.scss','./terminal-qc.component.scss']
})
export class TerminalQcComponent implements OnInit, OnDestroy {
  @Input() bodyOp: IBodyOp;
  @Input() op: string;
  @Input() model: Terminal;
  _tag: string = UtilData.txtTags[4];
  @Input()
  set tag(value) {
    this._tag = value;
  }

  @Input()
  set oid(value) {
    this.play();
  }

  @Input() tState: string;
  @Input() player: HTMLAudioElement;
  @Output() tStateChange = new EventEmitter<any>();



  trackUrl: string = 'assets/audio/alert1.mp3';
  //被选择的缺陷
  selDefect: IParameter;

  //其他 缺陷项的描述，也是valueStr
  otherReason: string = '';
  popStatus: boolean = false;
  image: ImageContent;

  //被选中的缺陷是要做报废处理的
  get isScraped(): boolean {
    return this.selDefect &&
      this.selDefect.tags.includes(UtilData.txtTags[19]) &&
      (this.selDefect.tags.includes(this.bodyOp.name) || this.isXP || this.isMB);
  }

  //前工序缺陷项
  get reasons(): IParameter[] {
    let reasonArr = [];
    if (this.bodyOp) {
      reasonArr = GlobalData.paras.filter(item =>
        item.tags.includes(this.bodyOp.pre) &&
        item.tags.includes(UtilData.txtTags[4]) &&
        item.tags.includes(UtilData.txtTags[18]));
    }
    reasonArr.push(GlobalData.paras.find(item => item.oid === '其他'));
    return reasonArr;
  }

  //本工序缺陷项
  get selfReasons(): IParameter[] {
    let reasonArr = [];
    if (this.bodyOp) {
      reasonArr = GlobalData.paras.filter(item =>
        item.tags.includes(this.bodyOp.name) &&
        item.tags.includes(UtilData.txtTags[4]) &&
        item.tags.includes(UtilData.txtTags[18]));
    }
    reasonArr.push(GlobalData.paras.find(item => item.oid === '其他'));
    return reasonArr;
  }

  /**
   * [判断当前终端是否为 成型 终端，成型终端不需要 缺陷确认， 直接 报废]
   * @return {boolean} [description]
   */
  get isCX(): boolean {
    return this.bodyOp && this.bodyOp.text === MaterialData.BodyOps.mold.text;
  }

  /**
   * [判断当前终端是否为 修坯 终端，修坯终端可以报废 上工序的缺陷]
   * @return {boolean} [description]
   */
  get isXP(): boolean {
    return this.bodyOp && this.bodyOp.text === MaterialData.BodyOps.trim.text;
  }

  /**
   * [判断当前终端是否为 磨边 终端，]
   * @return {boolean} [description]
   */
  get isMB(): boolean {
    return this.bodyOp && this.bodyOp.text === MaterialData.BodyOps.edge.text;
  }

  constructor(private service: MsubLotService,
    private modalService: NgbModal,
    private upload: UploadService) {
  }

  // showLargeModal() {
  //   this.tState="qc";
  //   const activeModal = this.modalService.open(ImgUploadComponent);

  //   activeModal.componentInstance.modalHeader = 'Large Modal';
  // }

  open() {
    // const modalRef = this.modalService.open(ImgUploadComponent);
    // modalRef.componentInstance.name = 'World';
  }

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

  /**
   * [选择本工序或上工序后，对应的调整可用缺陷]
   * @param {[type]} event [description]
   */
  onTabChange(event) {
    this.selDefect = undefined;
  }

  /**
   * [当选择了‘其他’缺陷项时，弹出窗口选择图片]
   * @param {[type]} reason [description]
   */
  onReasonClick(reason) {
    if(reason === '其他') {
      this.popStatus = true;
    }
  }

  /**
   * [半检，对本工单，本工序的半成品的质量问题，进行报废操作,
   * 特例： 如果是修坯，可对成型的坯体进行报废操作，
   * ]
   */
  onQCScrap() {
    this.model.reinit(MaterialData.BodyOps.scrap.text, this.selDefect ? [this.selDefect] : []);
    this.service.op(this.model).subscribe(item => {
      this.selDefect = undefined;
      this.model.reinit(this.op);
      this.tStateChange.emit(UtilData.terminalStates[0]);
    });
  }

  /**
   * [半检，对上工序的质量问题，进行undo操作]
   */
  onQCSubmit() {
    this.model.reinit(MaterialData.BodyOps.undo.text, this.selDefect ? [this.selDefect] : []);
    this.service.op(this.model).subscribe(item => {
      this.selDefect = undefined;
      this.model.reinit(this.op);
      this.tStateChange.emit(UtilData.terminalStates[0]);
    });
  }

  onQCCancel() {
    this.selDefect = undefined;
    this.tStateChange.emit(UtilData.terminalStates[0]);
  }

  /**
   * [缺陷图片文件的选择]
   */
  onPhotoSelect() {

  }

  onUploadFinished(fileHolder: any) {
    this.image = new ImageContent(fileHolder.file.name, fileHolder.src);
  }

  onRemoved(file: any) {
    console.log(file);
  }

  onUploadStateChanged(state: boolean) {
    console.log(state);
  }

  confirm(): void {
    //选中且不弹窗
    this.upload.uploadImage(this.image).subscribe(item => {
      console.log(item);
      this.selDefect.value.valueStr = item;
      this.selDefect.value.key = this.otherReason;
      this.reasons[this.reasons.length - 1].active = false;
      this.popStatus = false;
    });
  }

  cancel(): void {
    this.reasons[this.reasons.length - 1].active = true;
    this.popStatus = false;
  }

  ngOnDestroy() {
    // this.player.pause();
    // this.player.src = '';
    // this.player.load();
  }
}
