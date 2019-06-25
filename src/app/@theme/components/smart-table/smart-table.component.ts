import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, TableSettings } from '../../../@core/data/util.service';
import { IOrder } from '../../../@core/model/order';

@Component({
  selector: 'mes-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  //被选择的数据数组，多选的情况
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

  @Input()
  set multi(multi: any) {
    this.settings.selectMode = 'multi';
  };

  @Input()
  /**
   * [add description]
   * @param {boolean} add [description]
   */
  set add(add:boolean) {
    this.settings.actions.add = add;
  }


  @Input()
  /**
   * [del description]
   * @param {boolean} del [description]
   */
  set del(del:boolean){
    this.settings.actions.delete = del;
  }

	@Input() url: string = './';
  @Output() create = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
	@Output() rowSelected = new EventEmitter<any>();

	//ng2-smart-table 配置文件
	// settings = { ...TableSettings.basic };
  settings = _.cloneDeep(TableSettings.basic);

	//ng2-smart-table 呈现数据源
	source: LocalDataSource = new LocalDataSource();

	//每页显示的行数
  perPage: number = this.settings.pager.perPage;

  constructor(private router: Router,
    private route: ActivatedRoute) {

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

  onUserRowSelect(event): void {
    this.rowSelected.emit(event.selected);
  }

  onCreate(event): void {
    this.router.navigate([this.url, 'new'], { relativeTo: this.route });
  }

  onEdit(event): void {
    this.router.navigate([this.url, event.data._id], { relativeTo: this.route });
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
