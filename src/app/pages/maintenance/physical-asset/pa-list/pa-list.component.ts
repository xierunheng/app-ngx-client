import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaclassService } from '../../../../@core/data/paclass.service';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { LocalDataSource } from 'ng2-smart-table';
import { PhysicalAssetService } from '../../../../@core/data/physical-asset.service';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-pa-list',
  templateUrl: './pa-list.component.html',
  styleUrls: ['./pa-list.component.scss']
})
export class PaListComponent implements OnInit {

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
        title: '工装ID',
        type: 'string',
        // type: 'html',
        // valuePrepareFunction: (oid, row) => {
        //   return row.oid ? `<a href="/#/pages/resources/equip/workalert-detail">${oid}</a>` : '';
        // },
      },
      name: {
        title: '工装名称',
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
      loc: {
        title: '存储位置',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.loc ? `${row.loc.name} [${row.loc.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      paclass: {
        title: '工装类型',
        type: 'string',
        valuePrepareFunction: (paclass, row) => {
          return row.paclass && row.paclass.length > 0 ? row.paclass.map(item => item.oid).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
        }
      },
      // eaMapping: {
      //   title: '关联设备',
      //   type: 'string',
      //   valuePrepareFunction: (eaMapping, row) => {
      //     return row.eaMapping.equipment && row.eaMapping.equipment.length > 0 ? row.eaMapping.equipment.map(item => `${item.oid}-[${item.name}]`).join(', ') : '';
      //   },
      //   filterFunction: (value, search) => {
      //     return value.findIndex(v => (v.oid && v.name && `${v.oid}-[${v.name}]`.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      //   }
      // },
      fixedAssetID: {
        title: '固定资产ID',
        type: 'string',
      },
      vendorID: {
        title: '供应商ID',
        type: 'string',
      },
    };
  }

  constructor(private route: ActivatedRoute,
      private pacService: PaclassService,
      private service: PhysicalAssetService,) {
      this.initSetting();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.service.searchPhysicalAssets(params).subscribe(data => {
        this.source.load(data);
      })
    })
  }

}
