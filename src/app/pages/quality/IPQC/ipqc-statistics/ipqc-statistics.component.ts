import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilData, IDCmpFn, TableSettings, MaterialData, WorkData } from '../../../../@core/data/util.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../../../@core/model/global';
import { unitOfTime } from 'moment';

import { IHierarchyScope } from '../../../../@core/model/hs';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { PersonService } from '../../../../@core/data/person.service';
import { MdefService } from '../../../../@core/data/mdef.service';
import { IMsubLot, MsubLot, IMsubLotProfile } from '../../../../@core/model/msublot';
import { BarData, EchartBar, EchartBarData } from '../../../../@core/model/job-response';
import { OptionSet } from '../../../../@core/model/echart';

@Component({
  selector: 'ngx-ipqc-statistics',
  templateUrl: './ipqc-statistics.component.html',
  styleUrls: ['./ipqc-statistics.component.scss']
})
export class IPQCStatisticsComponent implements OnInit {


  /**
   * [查询所用的model]
   * 任何的查询条件，都在这里组织
   * @type {IMsubLot}
   */
  searchModel: IMsubLot = new MsubLot();

  pss: string[] = _.values(MaterialData.BodyOps).filter(bodyop => bodyop.url && bodyop.url !== '')
    .map(bodyop => bodyop.name);

  hss: IHierarchyScope[] = GlobalData.hss;

  persons = [];
  mdefs = [];

  //成型工下拉可选项
  ptree: TreeviewItem[];

  // tree of Mdef, with Mclass
  mtree: TreeviewItem[];

  //统计开始时间
  startTime: Date = new Date('2019-03-21');
  //统计结束时间
  endTime: Date = new Date('2019-03-22');

  // queryPara = { proseg: "", hss: [], persons: [], medf: [], startTime: moment().subtract(1, 'month'), endTime: new Date() };

  constructor(private location: Location,
    private mslService: MsubLotService,
    private pService: PersonService,
    private mService: MdefService) { }

  // get hstree() {
  //   return GlobalData.hstree;
  // }

  ngOnInit() {

    //初始化过滤条件
    // this.mService.getMdefsProfileBy().subscribe(ms => {
    //   this.mtree = this.mService.newMdefTree(ms);
    // });
    // console.log(this.mtree);
    // this.pService.getPersonsProfileBy().subscribe(ps => {
    //   this.ptree = this.pService.newPersonTree(ps);
    // });
    //let  queryPara = { startTime: new Date('2019-03-21'), endTime: new Date('2019-03-22') };

    let query = {};
    let groups: string[] = ['qcState'];
    this.mslService.aggrQC(this.startTime.toString(), this.endTime.toString(), groups, query)
      .subscribe(items => {
        console.log(items);
      });



  }

  //查询函数
  onSubmit(): void {


  }

}

