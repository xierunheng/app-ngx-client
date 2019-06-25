import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { LocalDataSource } from 'ng2-smart-table';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { PclassService } from '../../../../@core/data/pclass.service';
import { IPclass, Pclass } from '../../../../@core/model/pclass';
import { PersonService } from '../../../../@core/data/person.service';
import { IPerson, Person, IPersonElite } from '../../../../@core/model/person';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';

import { PclassInfoComponent } from './pclass-info/pclass-info.component';
import { PersonInfoComponent } from './person-info/person-info.component';

@Component({
  selector: 'mes-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.scss']
})
export class PersonnelComponent implements OnInit {
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  //查询条件
  query: any = {};

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  pcs: IPclass[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //树状呈现personnel
  ptree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  isMolder(item: IPersonElite): boolean {
    return true;
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: PclassService,
    private pService: PersonService,
    private dialogServie: NbDialogService) {
    this.initSetting();

    // console.log(route.params);
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '类型名称',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      prop: {
        title: '属性列',
        type: 'html',
        valuePrepareFunction: (prop, row) => {
          return `<a href="#/pages/productions/personnel/person/?pclass.oid=${row.oid}">${row.prop ? row.prop.length : 0}个</a>`;
        }
      },
      persons: {
        title: '员工列',
        type: 'html',
        valuePrepareFunction: (persons, row) => {
          return `<a href="#/pages/productions/personnel/person/?pclass.oid=${row.oid}">${row.persons ? row.persons.length : 0}人</a>`;
        }
      }
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.query = _.cloneDeep(params);
      if (this.query['hs.path']) {
        this.query['hs.path'] = { $regex: this.query['hs.path'] };
      }
      this.init();
    })
  }

  init(): void {
    this.loading = true;
    console.log(this.query);
    this.service.searchPclasssEncode(this.query).subscribe(pcs => {
      this.source.load(pcs);
      this.pcs = pcs;
      this.ptree = this.service.createPTree(pcs);
      this.loading = false;
    });
  }

  /**
   * [创建新的 pclass]
   * @param {IPclass = undefined} pc [description]
   */
  createPc(pc: IPclass = undefined): void {
    this.dialogServie.open(PclassInfoComponent, {
      context: {
        title: `新建 员工类型`,
        model: pc || new Pclass()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createPclass(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的person]
   * @param {IHierarchyScope = undefined} hs [description]
   */
  createP(p: IPerson = undefined): void {
    this.dialogServie.open(PersonInfoComponent, {
      context: {
        title: `新建 员工`,
        model: p || new Person()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.pService.createPerson(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改hs]
   * @param {IPclass} pc [description]
   */
  editPc(pc: IPclass): void {
    let modelObserver = jsonpatch.observe(pc);
    this.dialogServie.open(PclassInfoComponent, {
      context: {
        title: `更新 [${pc.oid}] 信息`,
        model: pc
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchPclass(pc._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改pclass]
   * @param {IPerson} p [description]
   */
  editP(p: IPersonElite): void {
    this.pService.getPerson(p._id).subscribe(p => {
      let modelObserver = jsonpatch.observe(p);
      this.dialogServie.open(PersonInfoComponent, {
        context: {
          title: `更新 [${p.oid}] 信息`,
          model: p,
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.pService.patchPerson(p._id, patch).subscribe(item => {
            this.init();
          })
        }
      });

    })

  }

  /**
   * [删除pclass]
   * @param {IPclass} pc [description]
   */
  removePc(pc: IPclass): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deletePclass(pc).subscribe(() => {
        this.init();
      });
    }
  }

  /**
   * [删除person]
   * @param {IPerson} p [description]
   */
  removeP(p: IPerson): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.pService.deletePerson(p).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    if (item === UtilData.systemObj.personnel.name) {
      //增加员工类型
      this.createPc();
    } else {
      let person = new Person();
      person.DeriveFromPclasss([item]);
      //增加员工
      this.createP(person);
    }
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.personnel.name) {

    } else if (item.name) {
      //修改员工
      this.editP(item);
    } else {
      //修改员工类型
      this.editPc(item);
    }
  }

  removeItem(item): void {
    if (item === UtilData.systemObj.personnel.name) {

    } else if (item.name) {
      //增加员工
      this.removeP(item);
    } else {
      //增加员工类型
      this.removePc(item);
    }
  }

  trimableItem(item): void {
    this.router.navigate(['trimable'], {relativeTo: this.route});
  }

  statsItem(item): void {
    this.router.navigate(['stats'], {relativeTo: this.route});
  }

  onDelete(event): void {
    this.service.deletePclass(event).subscribe(() => { });
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }


}
