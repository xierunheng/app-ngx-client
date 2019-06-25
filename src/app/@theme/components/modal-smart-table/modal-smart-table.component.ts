import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, TableSettings } from '../../../@core/data/util.service';
import { ViewConfig } from '../../../@core/utils/config';
import * as _ from 'lodash';
@Component({
  selector: 'mes-modal-smart-table',
  templateUrl: './modal-smart-table.component.html',
  styleUrls: ['./modal-smart-table.component.scss']
})
export class ModalSmartTableComponent implements OnInit {
  _resource: any;
  @Input()
  set resource(resource: any) {
    this._resource = resource;
    this.source.empty();
    this.source.load(resource);
  };
  @Input()
  set columns(columns: any) {
    this.settings.columns = columns;
  };

  @Input() modalComponent: any;
  @Input() title: string;
  @Input() oid: string;
  @Input() showAss: boolean;
  @Input() itemsDef: any;

  @Output() delete = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();

  //ng2-smart-table 配置文件
  settings = { ...TableSettings.basic };

  //ng2-smart-table 呈现数据源
  source: LocalDataSource = new LocalDataSource();

  //每页显示的行数
  perPage: number = this.settings.pager.perPage;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit() {

  }

  /**
   * [当每页显示数发生变化时，及时响应]
   * @param {[type]} perPage [description]
   */
  onPerPageChange(event) {
    this.perPage = event.target.valueAsNumber;
    this.source.setPaging(1, this.perPage, true);
  }

  /**
   * [是否显示perPage]
   * @return {boolean} [description]
   */
  shouldShow(): boolean {
    return this.source.count() > this.perPage;
  }

  initModal(modal: NgbModalRef) {
    modal.componentInstance.assM = this._resource;
    if (this.showAss !== undefined) {
      modal.componentInstance.showAss = this.showAss;
    }
    if (this.itemsDef) {
      modal.componentInstance.itemsDef = this.itemsDef;
    }
  }

  onCreate(event): void {
    const modal = this.modalService.open(this.modalComponent, { size: 'lg', container: 'nb-layout' });
    modal.componentInstance.vConfig = ViewConfig.create({
      title: `${UtilData.txtNew} [${this.oid}] ${this.title}信息`,
      buttonText: UtilData.txtNew,
      type: UtilData.txtCreateType
    });
    this.initModal(modal);
    modal.result.then((result) => {
      if(_.isArray(result)) {
        result.forEach(item => {
          this._resource.push(item);
        });
      } else {
        this._resource.push(result);
      }
      this.source.load(this._resource);
      this.change.emit();
    }, (reason) => {
      console.log(reason);
    });
  }

  onEdit(event): void {
    const modal = this.modalService.open(this.modalComponent, { size: 'lg', container: 'nb-layout' });
    modal.componentInstance.vConfig = ViewConfig.create({
      title: `${UtilData.txtUpdate} [${this.oid}] ${this.title}信息`,
      buttonText: UtilData.txtUpdate,
      type: UtilData.txtUpdateType
    });
    this.initModal(modal);
    modal.componentInstance.model = event.data;
    modal.result.then((result) => {
      this.source.update(event.data, result);
      this.change.emit();
    }, (reason) => {
      console.log(reason);
    });
  }

  /**
   * [ng2-smart-table's delete event]
   * @param {[type]} event [description]
   */
  onDelete(event): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      let index = this._resource.indexOf(event.data, 0);
      if (index > -1) {
        this._resource.splice(index, 1);
      }
      this.source.remove(event.data);
      this.change.emit();
      if (this.delete) {
        this.delete.emit(event.data);
      }
    }
  }

}
