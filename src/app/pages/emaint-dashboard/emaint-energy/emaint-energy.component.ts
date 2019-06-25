import { AfterViewInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { delay, takeWhile, switchMap } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';

import { ScadaDataService } from '../../../@core/data/scadaData.service';
import { IQuantity } from '../../../@core/model/common';

declare const echarts: any;

@Component({
	selector: 'mes-emaint-energy',
	templateUrl: './emaint-energy.component.html',
	styleUrls: ['./emaint-energy.component.scss']
})
export class EmaintEnergyComponent implements OnInit, AfterViewInit, OnDestroy {
	private alive = true;
	private value = 42;

	@Input('chartValue')
	set chartValue(value: number) {
		// this.value = value;

		// if (this.option.series) {
		// 	this.option.series[0].data[0].value = value;
		// 	this.option.series[0].data[1].value = 100 - value;
		// 	this.option.series[1].data[0].value = value;
		// }
	}

	intervalSubscription: Subscription;
	PwrUse: any;  //电量

	//总的用电量
	TotalUse: IQuantity;
	// WatUse: string;  //用水量

	option: any = {};
	themeSubscription: any;

	constructor(private theme: NbThemeService,
		private location: Location,
		private scadaService: ScadaDataService) {
	}

	ngOnInit() {
		this.init();

	}

	init(): void {
		this.scadaService.getSupervision().subscribe(data => {
			this.PwrUse = data.PwrUse;
			this.TotalUse = _.cloneDeep(this.PwrUse.value);
			this.TotalUse.quantity = _.round(this.PwrUse.value.quantity * 100 / this.value, 2);

			if (this.option.series) {
				this.option.series[0].data[0].value = this.value;
				this.option.series[0].data[1].value = 100 - this.value;
				this.option.series[1].data[0].value = this.value;
			}
			this.startReceivingLiveData();
		});
	}

	startReceivingLiveData() {
		if (this.intervalSubscription) {
			this.intervalSubscription.unsubscribe();
		}

		this.intervalSubscription = interval(30 * 1000)
			.pipe(
				takeWhile(() => this.alive),
				switchMap(() => this.scadaService.getSupervision()),
			)
			.subscribe(data => {
				this.PwrUse = data.PwrUse;
				this.TotalUse = _.cloneDeep(this.PwrUse.value);
				this.TotalUse.quantity = _.round(this.PwrUse.value.quantity * 100 / this.value, 2);

				if (this.option.series) {
					this.option.series[0].data[0].value = this.value;
					this.option.series[0].data[1].value = 100 - this.value;
					this.option.series[1].data[0].value = this.value;
				}
			});
	}

	ngAfterViewInit() {
		this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
			this.init();

			const solarTheme: any = config.variables.solar;

			this.option = Object.assign({}, {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				series: [
					{
						name: ' ',
						clockWise: true,
						hoverAnimation: false,
						type: 'pie',
						center: ['45%', '50%'],
						radius: solarTheme.radius,
						data: [
							{
								value: this.value,
								name: ' ',
								label: {
									normal: {
										position: 'center',
										formatter: '{d}%',
										textStyle: {
											fontSize: '22',
											fontFamily: config.variables.fontSecondary,
											fontWeight: '600',
											color: config.variables.fgHeading,
										},
									},
								},
								tooltip: {
									show: false,
								},
								itemStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{
												offset: 0,
												color: solarTheme.gradientLeft,
											},
											{
												offset: 1,
												color: solarTheme.gradientRight,
											},
										]),
										shadowColor: solarTheme.shadowColor,
										shadowBlur: 0,
										shadowOffsetX: 0,
										shadowOffsetY: 3,
									},
								},
								hoverAnimation: false,
							},
							{
								value: 100 - this.value,
								name: ' ',
								tooltip: {
									show: false,
								},
								label: {
									normal: {
										position: 'inner',
									},
								},
								itemStyle: {
									normal: {
										color: config.variables.layoutBg,
									},
								},
							},
						],
					},
					{
						name: ' ',
						clockWise: true,
						hoverAnimation: false,
						type: 'pie',
						center: ['45%', '50%'],
						radius: solarTheme.radius,
						data: [
							{
								value: this.value,
								name: ' ',
								label: {
									normal: {
										position: 'inner',
										show: false,
									},
								},
								tooltip: {
									show: false,
								},
								itemStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{
												offset: 0,
												color: solarTheme.gradientLeft,
											},
											{
												offset: 1,
												color: solarTheme.gradientRight,
											},
										]),
										shadowColor: solarTheme.shadowColor,
										shadowBlur: 7,
									},
								},
								hoverAnimation: false,
							},
							{
								value: 28,
								name: ' ',
								tooltip: {
									show: false,
								},
								label: {
									normal: {
										position: 'inner',
									},
								},
								itemStyle: {
									normal: {
										color: 'none',
									},
								},
							},
						],
					},
				],
			});
		});
	}

	ngOnDestroy() {
		this.themeSubscription.unsubscribe();
		this.alive = false;
	}
}
