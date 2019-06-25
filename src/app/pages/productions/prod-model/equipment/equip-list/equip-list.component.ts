import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EclassService } from '../../../../../@core/data/eclass.service';
import { UtilData, TableSettings } from '../../../../../@core/data/util.service';
import { LocalDataSource } from 'ng2-smart-table';
import { EquipmentService } from '../../../../../@core/data/equipment.service';


@Component({
  selector: 'ngx-equip-list',
  templateUrl: './equip-list.component.html',
  styleUrls: ['./equip-list.component.scss']
})
export class EquipListComponent implements OnInit {

  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();
  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
    oid: {
      title: '设备编号',
      type: 'html',
      valuePrepareFunction: (oid, row) => {
        return row.oid ? `<a href="/#/pages/resources/equip/detail">${oid}</a>` : '';
      },
    },
    name: {
      title: '设备名称',
      type: 'string',
    },
    supplier: {
      title: '供应商',
      type: 'string',
      valuePrepareFunction: (supplier, row) => {
        return row.supplier ? row.supplier.code + '-' + row.supplier.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.code &&
          `${value.code}-${value.oid}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
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
    eclass: {
      title: '设备类型',
      type: 'string',
      valuePrepareFunction: (eclass, row) => {
        return row.eclass && row.eclass.length > 0 ? row.eclass.map(item => item.oid).join(',') : '';
      },
      filterFunction: (value, search) => {
        return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      }
    },
    status: {
      title: '使用状态',
      type: 'string',
    },
  };
  }

  constructor(private route: ActivatedRoute,
      private ecService: EclassService,
      private service: EquipmentService,) { 
      this.initSetting();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
        this.service.searchEquips(params).subscribe(data=>{
            this.source.load(data);
        })
    })
  }

}
