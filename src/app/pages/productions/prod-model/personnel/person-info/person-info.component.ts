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
import { IPclassElite } from '../../../../../@core/model/pclass';
import { PclassService } from '../../../../../@core/data/pclass.service';
import { IPerson, Person, IUsedName } from '../../../../../@core/model/person';
import { PersonService } from '../../../../../@core/data/person.service';
import { PsubService } from '../../../../../@core/data/psub.service';


@Component({
  selector: 'mes-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss']
})
export class PersonInfoComponent implements OnInit {

  // array of Pclass, 员工类型
  pcs: IPclassElite[];

  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IPerson;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[1]];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: PersonService,
    private psService: PsubService,
    private pcService: PclassService,
    protected ref: NbDialogRef<PersonInfoComponent> ) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[1]));
  }

  /**
   * [判断当前员工是否为 成型工]
   */
  get isMolder(): boolean {
    return this.model && this.model.pclass.findIndex(pc => pc.oid === MaterialData.BodyOps.mold.oper) > -1;
  }

  /**
   * [判断当前员工是否为 公共生产员]
   * @return {boolean} [description]
   */
  get isPublic(): boolean {
    return this.model && this.model.pclass.findIndex(pc => pc.oid === UtilData.txtPublic) > -1;
  }

  ngOnInit(): void {
    this.pcService.getPclasssElite().subscribe(pcs => {
      this.pcs = pcs;
      //通过route的data区分新建数据和修改数据
      //更新：加载Person数据
      //新建：1-从Pclass新建，需要获取Pclass信息，再创建Person
      //     2-从Person-info界面新建，不需额外处理
      // this.route.data.subscribe(data => {
      //   this.vConfig = ViewConfig.create(data.config);
      //   if (this.vConfig.type === UtilData.txtUpdateType) {
      //     this.route.params.switchMap((params: Params) =>
      //       this.service.getPerson(params['pid'])).subscribe(item => {
      //         this.model = new Person(item);
      //         this.service.getDistinctMold(item._id).subscribe(molds => {
      //           console.log(molds);
      //         });
      //         this.modelObserver = jsonpatch.observe(this.model);
      //       });
      //   } else if (this.vConfig.type === UtilData.txtCreateByType) {
      //     this.route.params.switchMap((params: Params) =>
      //       this.pcService.getPclass(params['pcid'])).subscribe(item => {
      //         this.model = new Person();
      //         (this.model as Person).DeriveFromPclasss([item]);
      //         this.vConfig.title = this.vConfig.title.replace(UtilData.txtReplace, item.oid);
      //       });
      //   } else {
      //     this.model = new Person();
      //   }
      // });
    })
  }

  onPclassChange(items): void {
    if (items && items.length > 0) {
      let ids = items.map(item => item._id);
      this.pcService.getManyPclasss(ids).subscribe(pcs => {
        this.model = this.service.deriveFromPclasss(this.model, pcs);
        // this.model = new Person(this.model);
      })
    } else {
      this.model.pclass = [];
    }
  }

  onOidChange(event): void {
    if (this.model.oid.length > 2) {
      this.model.code = this.model.oid.substr(-2);
    }
  }

  /**
   * [当用户名发生变化时，我们需要把原来的用户名放在usedName 中]
   * @param {[type]} event [description]
   */
  onNameChange(event): void {
    let usedName: IUsedName = {
      name: this.model.name,
      deadline: new Date()
    };
    this.model.usedName.push(usedName);
    this.model.name = event.target.value;
  }

  /**
   * [从psub列表中，删除员工作业]
   * @param {[type]} event [description]
   */
  onDelete(event): void {
    console.log(event);
    this.psService.deletePsub(event).subscribe(() => {
    });
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
    // if (this.vConfig.type === UtilData.txtUpdateType) {
    //   let patch = jsonpatch.generate(this.modelObserver);
    //   //对patch做分析判断，如果是数组的更新，我们用update方法；如果是单个object的跟新，我们用patch方法
    //   if (patch.findIndex(item => item.path.startsWith('/psubs')) > -1) {
    //     this.service.updatePerson(this.model).subscribe(item => this.goBack());
    //   } else {
    //     this.service.patchPerson(this.model._id, patch).subscribe(item => this.goBack());
    //   }
    // } else if (this.vConfig.type === UtilData.txtCreateType ||
    //   this.vConfig.type === UtilData.txtCreateByType) {
    //   this.service.createPerson(this.model).subscribe(item => this.goBack());
    // }
  }

}
