import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, TableSettings } from '../../../@core/data/util.service';
import { ResProp, OpProp } from '../../../@core/model/common';
import { PropComponent } from '../prop/prop.component';

@Component({
  selector: 'mes-pop-smart-table',
  templateUrl: './pop-smart-table.component.html',
  styleUrls: ['./pop-smart-table.component.scss']
})
export class PopSmartTableComponent implements OnInit {
	_resource: any;
	@Input()
	set resource(resource: any) {
		this._resource = resource;
		this.source.empty();
		this.source.load(resource);
    // if(this._resource === "model.opprop"){
    //   this.settings = TableSettings.create('opProp', true);
    //   this.showQty = true;
    // }
	};
	@Input()
	set columns(columns: any) {
		this.settings.columns = columns;
	};
  @Input() tags: any[];
  @Input() showQty: any;

	@Output() delete = new EventEmitter<any>();

  @ViewChild('pop') public pop: any;

  propComp = PropComponent;

  //pop需要传的参数
  context: any;

  //是否显示数量
 // showQty: boolean = false;

	//ng2-smart-table 配置文件
	settings = { ...TableSettings.basic };

	//ng2-smart-table 呈现数据源
	source: LocalDataSource = new LocalDataSource();

	//每页显示的行数
  perPage: number = this.settings.pager.perPage;

  constructor() { }

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

  onCreate(event): void {
    let prop = new ResProp();
    // console.log(this._resource);
    // console.log(this.showQty);
    // if(this._resource === "model.opprop"){
    // //  this.settings = TableSettings.create('opProp', true);
    //   this.showQty = true;
    // }
    if (this.showQty) {
      prop = new OpProp;
    }
    this.context = {
      model: prop,
      tags: this.tags,
      pop: this.pop,
      source: this.source,
      resource: this._resource,
      buttonText: UtilData.txtNew,
      showQty: this.showQty,
    };
    setTimeout(() => {
      this.pop.toggle();
    }, 1);
  }

  onEdit(event): void {
    let prop = event.data;
    this.context = {
      model: prop,
      tags: this.tags,
      pop: this.pop,
      source: this.source,
      resource: this._resource,
      buttonText: UtilData.txtUpdate,
      showQty: this.showQty,
    };
    setTimeout(() => {
      this.pop.toggle();
    }, 1);
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
      if(this.delete) {
	      this.delete.emit(event.data);
      }
    }
  }
}
