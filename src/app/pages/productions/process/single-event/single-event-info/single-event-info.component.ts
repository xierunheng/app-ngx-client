import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';
import { GlobalData } from '../../../../../@core/model/global';
import { UtilData, IDCmpFn, TableSettings, MaterialData } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';
import { ISingleEvent, SingleEvent } from '../../../../../@core/model/single-event';
import { IEquipmentElite, EquipmentElite } from '../../../../../@core/model/equipment';
import { SingleEventService } from '../../../../../@core/data/single-event.service';
import { EquipmentService } from '../../../../../@core/data/equipment.service';
import { TreeviewItem } from 'ngx-treeview';



@Component({
  selector: 'ngx-single-event-info',
  templateUrl: './single-event-info.component.html',
  styleUrls: ['./single-event-info.component.scss']
})
export class SingleEventInfoComponent implements OnInit {


  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: ISingleEvent;

  // tree of Equipment,
  etree: TreeviewItem[];

  height : number;
  ssize : string;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  objectTypes: string[] = ['Batch Production Record', 'Change', 'Comment', 'Control Recipe', 'Data Set', 'Event',
      'Master Recipe', 'Operations Definition', 'Operations Performance', 'Operations Schedule',
      'Product Definition', 'Production Performance', 'Production Schedule',
      'Personnel Identification Manifest', 'Resource Definition Manifest', 'Recipe Element',
      'Sample', 'Sample Test', 'Sample Test Result', 'Work Directive', 'Work Master', 'Work Performance', 'Work'
    ];

  eventTypes: string[] = ['Alarm', 'Control Recipe', 'Equipment', 'General', 'Material',
      'Message', 'Operator', 'Procedural Execution', 'Other'
    ];

  eventSubTypes: string[] = ['Allocation', 'Application', 'Consume', 'Deallocation', 'Equipment',
      'Message', 'Mode Change', 'Mode Command', 'Modification', 'Movement',
      'Parameter Data', 'Process', 'Process Data', 'Produce', 'Prompt',
      'Prompt Response', 'Property Value Change', 'Reconciliation', 'Security', 'State Change',
      'State Command', 'Status Change', 'System', 'Target End Time', 'Target Start Time', 'Other'
    ];

  categorys: string[] = ['Informational', 'Critical', 'Other'];

  alarmEvents: string[] = ['Detected', 'Acknowledged', 'Cleared', 'Other'];

  alarmTypes: string[] = ['High', 'Low', 'Deviation', 'Rate of Change', 'Other'];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: SingleEventService,
    private eService: EquipmentService,
    protected ref: NbDialogRef<SingleEventInfoComponent> ) {
  }

  get hstree() {
    return GlobalData.hstree;
  }


  ngOnInit(): void {
    //获取浏览器窗口的可视区域的高度
    this.height = document.body.clientHeight;
     //根据高度大小确定弹窗的大小
    if ( this.height > 816 ) {
      this.ssize = 'xxlarge';
    } else if ( this.height > 696 ) {
      this.ssize = 'xlarge';
    } else if (this.height > 576 ) {
      this.ssize = 'large';
    } else {
      this.ssize = 'medium';
    }

    this.eService.getEquipmentsProfile().subscribe(es => {
      this.etree = this.eService.newEquipmentTree(es);
    });
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    console.log(this.model);
    this.ref.close(this.model);

  }

}

