import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';

import { UtilData, IDCmpFn } from '../../../../@core/data/util.service';
import { ITerminalDef, TerminalDef } from '../../../../@core/model/terminal-def';
import { TerminalDefService } from '../../../../@core/data/terminal-def.service';
import { IProsegElite } from '../../../../@core/model/proseg';
import { ProsegService } from '../../../../@core/data/proseg.service';

@Component({
  selector: 'mes-terminal-def-info',
  templateUrl: './terminal-def-info.component.html',
  styleUrls: ['./terminal-def-info.component.scss']
})
export class TerminalDefInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: ITerminalDef;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //工艺段下拉列表
  pss: IProsegElite[];
  proseg: any[];

  categorys: string[];
  resolutions: string[];
  sizes: string[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: TerminalDefService,
    private psService: ProsegService,
    protected ref: NbDialogRef<TerminalDefInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  /**
   * 当标签选择发生变化时
   * @param {IProsegElite[]} selItems [description]
   */
  onSelectedChange(item): void {
    //this.model.ps = items;
    console.log(item.target.selectedIndex);
    let id = this.pss[item.target.selectedIndex]._id;
    console.log(id);
    this.psService.getProseg(id).subscribe(ps => {
      this.model.ps._id = ps._id;
      this.model.ps.oid = ps.oid;
      this.model.ps.no = ps.no;
      this.model.ps.code = ps.code;
    });
  }

  ngOnInit(): void {
    this.psService.getProsegsElite().subscribe(pss => {
      this.pss = pss;
    });
    GlobalData.hss$.subscribe(hss => {
      this.categorys = UtilData.terminalCategorys;
      this.resolutions = UtilData.terminalResolutions;
      this.sizes = UtilData.terminalSizes;
    })
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    console.log(this.model);
    this.ref.close(this.model);
  }


}
