import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../../../@core/model/global';
import { UtilData,
  IDCmpFn, MaterialData, TableSettings } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';

import { MsubLot } from '../../../../@core/model/msublot';
import { MsubLotService } from '../../../../@core/data/msublot.service';
// import { HeatTestComponent } from '../heat-test/heat-test.component';

@Component({
  selector: 'mes-prod-trace',
  templateUrl: './prod-trace.component.html',
  styleUrls: ['./prod-trace.component.scss']
})
export class ProdTraceComponent implements OnInit {
//窗口信息的显示方式，包括‘窗体’和‘追溯’
  showtype = 'form';

  // this model is nothing but for [(ngModel)]
  // copied from server's MaterialSubLotSchema
  model: MsubLot;
  modelObserver: any;

  //界面配置接口
  vConfig: ViewConfig;

  //单独的 materialSublot 呈现的 tree
  msltree: TreeviewItem[];

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //装配类型可选项
  assTypes: string[] = MaterialData.assemblyTypes;

  //装配关系可选项
  assRels: string[] = MaterialData.assemblyRelations;

  //物料批次的状态可选项
  statuses: string[] = MaterialData.statuses;

  propcolumns: any = TableSettings.resPropColumns;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[3]];

  /**
   * [该物料子批次是否为 托盘，托盘是可打印的]
   * @return {boolean} [description]
   */
  get isTP(): boolean {
    return this.model && this.model.mdef.oid && this.model.mdef.oid.includes(UtilData.txtTP);
  }

  get isZX(): boolean {
    return this.model && this.model.mdef.oid && this.model.mdef.oid.includes(UtilData.txtZX);
  }
  /**
   * [该物料子坯体是否为 坯体，坯体显示进度条]
   * @return {boolean} [description]
   */
  get isPT(): boolean {
    return this.model && this.model.mclass[0].oid.includes(UtilData.txtPT);
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: MsubLotService,
    private modalService: NgbModal
  ) {
        // this.model = 
  }

  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[3]));
  }

  ngOnInit(): void {
    // this.route.data.subscribe(data => {
    //   this.vConfig = ViewConfig.create(data.config);
    //   console.log(this.vConfig);
    //   if (this.vConfig.type === UtilData.txtUpdateType) {
    //     this.route.params.switchMap((params: Params) =>
    //       this.service.getMsubLot(params['mslid'])).subscribe(item => {
    //         this.msltree = this.service.newMsublotTree(item);
    //         this.model = new MsubLot(item);
    //         console.log(this.model);
    //         this.modelObserver = jsonpatch.observe(this.model);
    //       });
    //   }
    // });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(value: any): void {
    // let patch = jsonpatch.generate(this.modelObserver);
    // this.service.patchMsubLot(this.model._id, patch).subscribe(item => this.goBack());
      console.log(value);
      let oid = value.oid;
      console.log(oid);
      this.service.getMsubLotByOid(oid).subscribe(item => {
        console.log(item);
        this.msltree = this.service.newMsublotTree(item);
        this.model = new MsubLot(item);
        console.log(this.model);
        this.modelObserver = jsonpatch.observe(this.model);
      });
  }

  openHeatTest(): void {
    // this.modalService.open(
    //   HeatTestComponent, 
    //   { size: 'lg', backdrop: 'static', container: 'nb-layout', windowClass: 'fullscreen-modal-dialog' }
    // );
  }

  print(): void {
    this.router.navigate(['/prints/tplabel/', this.model._id], { relativeTo: this.route });
  }

  change(val){
      console.log(val);
  }

}
