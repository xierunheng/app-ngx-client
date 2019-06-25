import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { EmaintQtyChartComponent } from './emaint-qty-chart/emaint-qty-chart.component';
import { EmaintQcChartComponent} from './emaint-qc-chart/emaint-qc-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';

@Component({
	selector: 'mes-emaint-charts-panel',
	templateUrl: './emaint-charts-panel.component.html',
	styleUrls: ['./emaint-charts-panel.component.scss']
})
export class EmaintChartsPanelComponent implements OnInit, OnDestroy {
	private alive = true;

	chartPanelSummary: OrderProfitChartSummary[];
	period: string = 'week';
	ordersChartData: OrdersChart;
	profitChartData: ProfitChart;

	@ViewChild('ordersChart') ordersChart: EmaintQtyChartComponent;
	@ViewChild('profitChart') profitChart: EmaintQcChartComponent;

	constructor(private ordersProfitChartService: OrdersProfitChartData) {
		this.ordersProfitChartService.getOrderProfitChartSummary()
			.pipe(takeWhile(() => this.alive))
			.subscribe((summary) => {
				this.chartPanelSummary = summary;
			});

		this.getOrdersChartData(this.period);
		this.getProfitChartData(this.period);
	}

	ngOnInit() {

	}

	setPeriodAndGetChartData(value: string): void {
		if (this.period !== value) {
			this.period = value;
		}

		this.getOrdersChartData(value);
		this.getProfitChartData(value);
	}

	changeTab(selectedTab) {
		if (selectedTab.tabTitle === 'Profit') {
			this.profitChart.resizeChart();
		} else {
			this.ordersChart.resizeChart();
		}
	}

	getOrdersChartData(period: string) {
		this.ordersProfitChartService.getOrdersChartData(period)
			.pipe(takeWhile(() => this.alive))
			.subscribe(ordersChartData => {
				this.ordersChartData = ordersChartData;
			});
	}

	getProfitChartData(period: string) {
		this.ordersProfitChartService.getProfitChartData(period)
			.pipe(takeWhile(() => this.alive))
			.subscribe(profitChartData => {
				this.profitChartData = profitChartData;
			});
	}

	ngOnDestroy() {
		this.alive = false;
	}

}
