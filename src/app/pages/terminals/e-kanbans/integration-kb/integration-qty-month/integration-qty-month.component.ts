import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../../@core/data/orders-profit-chart';
import { OrdersChart } from '../../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../../@core/utils/layout.service';
import { IQuantity } from '../../../../../@core/model/common';

@Component({
  selector: 'mes-integration-qty-month',
  templateUrl: './integration-qty-month.component.html',
  styleUrls: ['./integration-qty-month.component.scss']
})
export class IntegrationQtyMonthComponent implements OnDestroy {
  private alive = true;

  _jrs: any[];
  @Input()
  set jrs(jrs: any[]) {
    this._jrs = jrs;
    this.init(jrs);
  }

  //产量趋势呈现的数据
  qtyData: any[];

  PQ: IQuantity;

  //质量指标呈现的数据
  qrData: any[];

  GQ: IQuantity;

  //废品率呈现的数据
  srData: any[];

  SQ: IQuantity;

  chartPanelSummary: OrderProfitChartSummary[];

  options: any = {};
  echartsIntance: any;
  themeSubscription: any;

  summary: any = [{
    title: '良品率',
    value: 83,
  }, {
    title: '良品数',
    value: 128,
  }, {
    title: '废品数',
    value: 21,
  }];

  constructor() {
  }

  init(items: any[]) {
    if (items && items.length > 0) {

      this.qtyData = items.map(item => {
        return {
          oid: item.oid.substring(6, 8),
          qty: item.qty.quantity + item.ngqty.quantity
        }
      });
      this.PQ = {
        quantity: this.qtyData.map(item => item.qty).reduce((prev, curr) => prev + curr),
        unit: items[0].qty.unit
      };

      this.qrData = items.map(item => {
        return {
          oid: item.oid,
          qty: item.qty.quantity,
          ratio: _.round(item.qty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
        }
      });
      this.GQ = {
        quantity: this.qrData.map(item => item.qty).reduce((prev, curr) => prev + curr),
        unit: items[0].qty.unit
      };

      this.srData = items.map(item => {
        return {
          oid: item.oid,
          qty: item.ngqty.quantity,
          ratio: _.round(item.ngqty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
        }
      });
      this.SQ = {
        quantity: this.srData.map(item => item.qty).reduce((prev, curr) => prev + curr),
        unit: items[0].qty.unit
      };

      this.summary = [{
        title: '良品率',
        value: this.PQ.quantity ? Math.round(this.GQ.quantity / this.PQ.quantity * 100) : 0,
      }, {
        title: '良品数',
        value: this.GQ.quantity ? this.GQ.quantity : 0,
      }, {
        title: '废品数',
        value: this.SQ.quantity ? this.SQ.quantity : 0,
      }]; 
    }
  }


  ngOnDestroy() {
    this.alive = false;

  }

}
