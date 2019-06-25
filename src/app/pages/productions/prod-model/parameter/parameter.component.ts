import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogService } from '@nebular/theme';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { treeConfig, ViewConfig } from '../../../../@core/utils/config';

import { GlobalData } from '../../../../@core/model/global';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { ParameterService } from '../../../../@core/data/parameter.service';

import { IParameter, Parameter } from '../../../../@core/model/parameter';
import { ParaInfoComponent } from './para-info/para-info.component';



@Component({
  selector: 'mes-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  settings = {...TableSettings.basic};

  source: LocalDataSource = new LocalDataSource();
  //每页显示的行数
  perPage: number = this.settings.pager.perPage;

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  paratree: any;

  isTag = this.service.isTag;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: ParameterService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '名称',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      value: {
      	title: '属性值',
      	type: 'string',
        valuePrepareFunction: (value, row) => {
          return row.value ? `${row.value.valueStr}${row.value.unit}` : '';
        },
      },
      tags: {
      	title: '属性标签',
      	type: 'string',
      	valuePrepareFunction: (tags, row) => {
          return row.tags && row.tags.length > 0 ? row.tags.join(',') : '';
        },
      },
      active: {
      title: '可用',
	      filter: {
	        type: 'checkbox',
	        config: {
	          true: 'true',
	          false: 'false',
	          resetText: '全显',
	        },
	      },
	      editor: {
	        type: 'checkbox',
	      }
	    },
    };
  }

  ngOnInit() {
  	this.service.getParameters()
  		.subscribe(paras => {
  			this.source.empty();
  			this.source.load(paras);
        this.paratree = this.service.createTree(paras);
  		// this.SocketService.syncUpdates('thing', this.awesomeThings);
  		});

  }

  /**
   * [当patameter发生变化时，可能会连带其他的patameter发生变化，
   * 所以每次发生变化时，需要连带所有的patameter都更新]
   */
  init(): void {
    this.loading = true;
    this.service.getParameters().subscribe(paras => {
      this.source.load(paras);
      this.paratree = this.service.createTree(paras);
      this.loading = false;
    });
  }

  /**
   * [当每页显示数发生变化时，及时响应]
   * @param {[type]} perPage [description]
   */
  onPerPageChange(event,paras) {
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

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

	remove(event): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteParameter(event)
        .subscribe(() => {
          this.source.remove(event);
          this.paratree = this.service.createTree(GlobalData.paras);
        });
    }
  }


  /**
   * [创建新的Parameter]
   * @param {IParameter = undefined} Parameter [description]
   */
  create(paras:IParameter= undefined): void {
    this.dialogServie.open(ParaInfoComponent, {
      context: {
        title: "新建 属性项",
        model: paras || new Parameter()
      },
    }).onClose.subscribe(rnParas => {
      if(rnParas) {
        this.service.createParameter(rnParas).subscribe(item => {
          // console.log(item);
          //this.source.prepend(item);
           this.init();
        })
      }
    });
  }

  /**
   * [修改Parameter]
   * @param {IParameter} Parameter [description]
   */
  edit(paras: IParameter): void {
    console.log(paras);
    let oldparas: IParameter = _.cloneDeep(paras);
    let modelObserver = jsonpatch.observe(paras);
    this.dialogServie.open(ParaInfoComponent, {
      context: {
        title: `更新 [${paras.oid}] 信息`,
        model: paras 
      },
    }).onClose.subscribe(rnparas => {
      if(rnparas) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchParameter(paras._id, patch).subscribe(item => {
          // this.source.refresh();
          this.init();
        })
      }
    });
  }

  onFilterChange(event): void {

  }

  onParaChange(event): void {

  }

  addItem(item): void {
    let model = new Parameter();
    model.tags=[item.text];
    this.create(model);
  }

}
