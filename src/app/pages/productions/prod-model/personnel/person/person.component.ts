import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { GlobalData } from '../../../../../@core/model/global';
import { PersonService } from '../../../../../@core/data/person.service';
import { PclassService } from '../../../../../@core/data/pclass.service';
import { IPerson, Person, IPersonProfile } from '../../../../../@core/model/person';
import { Pclass } from '../../../../../@core/model/pclass';
import { UtilData, TableSettings } from '../../../../../@core/data/util.service';
import { PclassElite } from '../../../../../@core/model/pclass';
import { PersonInfoComponent } from '../person-info/person-info.component';

@Component({
  selector: 'mes-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit, OnDestroy {

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  persons: IPerson[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: PersonService,
    private pcService: PclassService,
    private dialogServie: NbDialogService) {
    this.initSetting();
    
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      name: {
        title: '姓名',
        type: 'string',
      },
      code: {
        title: '编号',
        type: 'string',
      },
      mobile: {
        title: '手机号',
        type: 'string',
      },
      pclass: {
        title: '员工类型',
        type: 'string',
        valuePrepareFunction: (pclass, row) => {
          return row.pclass && row.pclass.length > 0 ? row.pclass.map((item) => item.oid).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value && value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
        }
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
      desc: {
        title: '描述',
        type: 'string',
      },
    };

  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      this.service.searchPersons(params).subscribe(ps => {
        this.source.load(ps);
        this.persons = ps;
        this.loading = false;
      })
    });
  }

  /**
   * [创建新的person]
   * @param {IHierarchyScope = undefined} hs [description]
   */
  create(p: IPerson = undefined): void {
    this.dialogServie.open(PersonInfoComponent, {
      context: {
        title: `新建 员工类型`,
        model: p || new Person()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createPerson(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改pclass]
   * @param {IPerson} p [description]
   */
  editP(p: IPerson): void {
    let modelObserver = jsonpatch.observe(p);
    this.dialogServie.open(PersonInfoComponent, {
      context: {
        title: `更新 [${p.oid}] 信息`,
        model: p,
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchPerson(p._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [删除person]
   * @param {IPerson} p [description]
   */
  remove(p: IPerson): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deletePerson(p).subscribe(() => {
        this.init();
      });
    }
  }

  importData(data): void {
    let pcs = [];
    let pcoids = _.uniq(data.map(d => d['员工类型']));
    console.log(pcoids);
    this.pcService.getPclasssBy({ oid: { $in: pcoids } }).subscribe(items => {
      pcs = _.cloneDeep(items);

      let persons = data.map(d => {
        let person = new Person();
        let pclass = pcs.filter(item => item.oid === d['员工类型'].trim());
        if (pclass) {
          person.DeriveFromPclasss(pclass);
        }
        person.oid = d['员工编号_ID'];
        if (d['员工编码']) {
          person.code = d['员工编码'];
        }
        person.name = d['姓名'];
        person.desc = d['现任职务'];
        let hs = GlobalData.hss.find(item => item.name === d['现任部门'].trim());
        if (hs) {
          person.hs = _.cloneDeep(hs);
        }
        return person;
      });
      this.service.upsertPersons(persons).subscribe(items => {
        console.log(items);
      })
    });
  }

  ngOnDestroy() {
  }

}
