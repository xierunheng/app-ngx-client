import { Component, OnInit } from '@angular/core';
import { UtilData, WorkData } from '../../../@core/data/util.service';
import { Terminal } from '../../../@core/model/terminal';
import { IQuantity, Quantity } from './../../../@core/model/common';
import { IJobOrder, JobOrder } from './../../../@core/model/job-order';
import { JobOrderService } from './../../../@core/data/job-order.service';
import { JobResponseService } from './../../../@core/data/job-response.service';

@Component({
  selector: 'mes-terminal-footer',
  templateUrl: './terminal-footer.component.html',
  styleUrls: ['./terminal-footer.component.scss']
})
export class TerminalFooterComponent implements OnInit {
  //待开工工单列表
  jos: IJobOrder[];

  //选择的工单
  jo: JobOrder;

  constructor() { }

  ngOnInit() {
  }

/**
   * [当工单选择发生变化后，执行相关的操作]
   * @param {[type]} jo [description]
   */
  onJOSelect(item): void {
    this.jo = new JobOrder(item);
  }

}
