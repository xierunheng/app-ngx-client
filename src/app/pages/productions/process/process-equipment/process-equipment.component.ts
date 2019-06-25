import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EquipmentData } from '../../../../@core/model/edata';
import { EquipData, NameCmpFn } from '../../../../@core/data/util.service';
import { EdataService } from '../../../../@core/data/edata.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { delay } from 'rxjs/operators';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
	selector: 'mes-process-equipment',
	templateUrl: './process-equipment.component.html',
	styleUrls: ['./process-equipment.component.scss']
})
export class ProcessEquipmentComponent implements OnInit, AfterViewInit, OnDestroy {

	settings = { ...TableSettings.basic };

	source: LocalDataSource = new LocalDataSource();

	//设备和环境参数查询结果数据汇总
	resouce: any[] = [];

	//显示的类型, table or chart, default is chart
    showtype: string = 'chart';
	/**
	 * [可选设备名称列表]
	 * @type {string[]}
	 */
	equipNames: string[];

	/**
	 * [选中的设备名称]
	 * @type {string}
	 */
	equipName: string;

	/**
	 * [统计的起始时间]
	 * @type {Date}
	 */
	startTime: Date = moment().subtract(14, 'day').toDate();

	/**
	 * [统计的结束时间]
	 * @type {Date}
	 */
	endTime: Date = new Date();

	/**
	 * [可选设备参数列表]
	 * @type {any[]}
	 */
	equipParas: any[];

	/**
	 * [选中的设备参数项]
	 * @type {any[]}
	 */
	equipPara: any[] = [];

	/**
	 * [可选的环境参数列表]
	 * @type {any[]}
	 */
	envParas: any[];


	/**
	 * [选中的环境参数项]
	 * @type {any[]}
	 */
	envPara: any[] = [];

	/**
	 * [名称对比函数]
	 * @type {[type]}
	 */
	nameCmpFn = NameCmpFn;

	data: any[] = [];
	yData: any[] = [];//所有y轴数据
	yData1: any[] = [];//设备参数y轴数据
	yData2: any[] = [];//环境参数y轴数据
	yIndex: number = 0;
	// yIndex2:number =0;



	option: any;

	themeSubscription: any;

	constructor(private theme: NbThemeService,
		private edService: EdataService) {
		this.initSetting();

	}

	ngOnInit() {
		//后续的设备的参数功能，需要做成可配置的
		let equips = _.values(EquipData.plcKiln).slice(0, -1);
		this.equipNames = equips.map(item => item.text);
		this.equipParas = _.values(equips[0]).filter(item => !_.isString(item));
		let env = _.values(EquipData.plcKiln).slice(-1);
		this.envParas = _.values(env[0]).filter(item => !_.isString(item));

	}

	initSetting(): void {
	    this.settings.mode = TableSettings.exMode;
	    this.settings.columns = {
		    oid: {
		      title: 'OID',
		      type: 'string',
		    },
		    name: {
		      title: '名称',
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
		    startTime: {
		      title: '数采起时',
		      type: 'string',
		      valuePrepareFunction: (startTime, row) => {
		        return row.startTime ? moment(row.startTime).format('YYYY-MM-DD') : '';
		      },
		    },
		    endTime: {
		      title: '数采终时',
		      type: 'string',
		      valuePrepareFunction: (endTime, row) => {
		        return row.endTime ? moment(row.endTime).format('YYYY-MM-DD') : '';
		      },
		    },
		    duration: {
		      title: '数采周期',
		      type: 'string',
		      valuePrepareFunction: (duration, row) => {
		        return row.duration ? row.duration.quantity + row.duration.unit : '';
		      },
		    },
		};
	}

	onEquipParaChange(event) {
		// this.equipPara = event;
		this.init();
	}

	onEnvParaChange(event) {
		this.init();
	}

	onStartTimeChange(event) {
		this.startTime = event;
		this.init();
	}

	onEndTimeChange(event) {
		this.endTime = event;
		this.init();
	}

	//设备参数数据根据单位指定对应的y轴值
	classifyByEqUnits(data) {
		let yIndex = 0;
		switch (data) {
			case "℃":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '1℃'; });
				break;
			case "Hz":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '1Hz'; });
				break;
			case "m³/h":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '1m³/h'; });
				break;
			case "kPa":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '1kPa'; });
				break;
			case "m³":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '1m³'; });
				break;
			default:
				break;
		}

		return yIndex;
	};

	//环境参数数据根据单位指定对应的y轴值
	classifyByEnvUnits(data) {
		let yIndex = 0;
		switch (data) {
			case "℃":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2℃'; });
				break;
			case "°":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2°'; });
				break;
			case "m/s":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2m/s'; });
				break;
			case "%RH":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2%RH'; });
				break;
			case "hPa":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2hPa'; });
				break;
			case "mm":
				yIndex = _.findIndex(this.yData, function(o) { return o.id == '2mm'; });
				break;
			default:
				// code...
				break;
		}

		return yIndex;
	};

	init(): void {
		if (this.startTime && this.endTime && this.option) {
			this.data = [];
			this.yData = [];
			this.resouce = [];
			// console.log(this.startTime);
			// console.log(this.endTime);
			if (this.equipPara.length > 0) {

				this.edService.getEdatasBy({
					'equipment.name': this.equipName,
					name: { $in: this.equipPara.map(item => item.name) },
					startTime:this.startTime, 
					endTime: this.endTime 
				}).subscribe(items => {
					this.resouce = this.resouce.concat(items);
					this.source.load(this.resouce);
					
					// this.equipResData=items;
					console.log("equipResData",items);
					this.yData1 = [];

					if (items && items.length > 0) {
						let paraData = _.groupBy(items, 'name');
						console.log(paraData);
						let yData = _.groupBy(items, 'unit');
						this.yIndex = this.yData.length;
						var index = 0;
						//动态生成环境参数y轴
						_.forOwn(yData, (datas, key) => {
							let y = {
								type: 'value',
								id: '1' + key,
								name: key,
								nameTextStyle: {
									fontSize: 16,
									verticalAlign: 'top',
									color: '#000000'
								},
								gridIndex: 0,

								min: 'dataMin',
								max: 'dataMax',
								position: 'right',
								offset: 80 * index,
								splitNumber: '5',
								axisLabel: {
									fontSize: 18,
									color: '#000000',
									formatter: function(v) {
										return v.toFixed(1)
									}
								},
								axisLine: {
									lineStyle: {
										color: '#000000'
									},
								},
							}
							index = index + 1;
							this.yData1.push(y);
							this.yData.push(y);
						})

						_.forOwn(paraData, (datas, key) => {
							let values = [];
							_.orderBy(datas, 'startTime').forEach(item => {
								let time = moment(item.startTime);
								console.log(time);

								_.forOwn(item.metrics, (hourValue, hourKey) => {
									let hour = Number(hourKey);
									_.forOwn(hourValue, (minuteValue, minuteKey) => {
										let minute = Number(minuteKey);
										time.hour(hour);
										time.minute(minute);
										values.push([time.format(), minuteValue]);					
									});
								});
							})
							//设备参数数据根据单位指定对应的y轴值
							let yIndex = this.classifyByEqUnits(`${datas[0].unit}`)

							let d = {//参数定制
								name: `${key}(${datas[0].unit})`,
								data: values,
								yAxisIndex: yIndex,
								xAxisIndex: 0,
							}
							this.data.push(d);
						})

						if (this.data && this.data.length > 0 && this.option) {
							if (this.option.series) {

								this.option.series = this.data.map(item => {
									return {
										name: item.name,
										type: 'line',
										yAxisIndex: item.yAxisIndex,
										xAxisIndex: item.xAxisIndex,
										data: item.data,
										showSymbol: false,
										sampling: 'average',
										showAllSymbol: false,
										markPoint: {
											data: [
												{ type: 'max', name: '最大值' },
												{ type: 'min', name: '最小值' }
											]
										},
									};
								});
							}
							if (this.option.legend) {
								this.option.legend.data = this.data.map(item => item.name);
							}
							if (this.option.yAxis) {
								this.option.yAxis = this.yData.map(item => item);
								// console.log("y值", this.option.yAxis)
							}
							// console.log("option", this.option)
							this.option = Object.assign({}, this.option);
							console.log(this.option);
						}
					}
				});
			}


			if (this.envPara.length > 0) {
				this.edService.getEdatasBy({
					name: { $in: this.envPara.map(item => item.name) },
					startTime:this.startTime,
					endTime: this.endTime
				}).subscribe(items => {
					this.resouce = this.resouce.concat(items);
					this.source.load(this.resouce);

					this.yData2 = [];
					if (items && items.length > 0) {
						let paraData = _.groupBy(items, 'name');
						let yData = _.groupBy(items, 'unit');
						this.yIndex = this.yData.length;
						var index = 0;
						//动态生成环境参数y轴
						_.forOwn(yData, (datas, key) => {

							let y = {
								type: 'value',
								id: '2' + key,
								name: key,
								nameTextStyle: {
									fontSize: 16,
									verticalAlign: 'top',
									color: '#000000'
								},
								gridIndex: 1,

								min: 'dataMin',
								max: 'dataMax',
								position: 'right',
								offset: 80 * index,
								splitNumber: '5',
								axisLabel: {
									fontSize: 18,
									color: '#000000',
									formatter: function(v) {
										return v.toFixed(1)
									}

								},
								axisLine: {
									lineStyle: {
										color: '#000000'
									},
								},
							}
							index = index + 1;
							this.yData.push(y);
						})
						_.forOwn(paraData, (datas, key) => {
							let values = [];
							_.orderBy(datas, 'startTime').forEach(item => {
								let time = moment(item.startTime);
								_.forOwn(item.metrics, (hourValue, hourKey) => {
									let hour = Number(hourKey);
									_.forOwn(hourValue, (minuteValue, minuteKey) => {
										let minute = Number(minuteKey);
										time.hour(hour);
										time.minute(minute);
										values.push([time.format(), minuteValue]);
									});
								});
							})
							//环境参数数据根据单位指定对应的y轴值
							let yIndex = this.classifyByEnvUnits(`${datas[0].unit}`)
							let d = {
								name: `${key}(${datas[0].unit})`,
								data: values,
								yAxisIndex: yIndex,
								xAxisIndex: 1,
							}
							this.data.push(d);
						})

						if (this.data && this.data.length > 0 && this.option) {
							if (this.option.series) {

								this.option.series = this.data.map(item => {
									return {
										name: item.name,
										type: 'line',
										yAxisIndex: item.yAxisIndex,
										xAxisIndex: item.xAxisIndex,//定制数据在哪个坐标轴显示
										data: item.data,
										showSymbol: false,
										sampling: 'average',
										showAllSymbol: false,
										markPoint: {
											data: [
												{ type: 'max', name: '最大值' },
												{ type: 'min', name: '最小值' }
											]
										},
									};
								});
							}
							if (this.option.legend) {
								this.option.legend.data = this.data.map(item => item.name);
							}
							if (this.option.yAxis) {
								this.option.yAxis = this.yData.map(item => item);
								// console.log("y值", this.option.yAxis)
							}
							// console.log("env", this.option.series)
							this.option = Object.assign({}, this.option);
						}
					} else {
						alert("该时间段统计信息为空")
					}
				});
			}
		}
	}



	ngAfterViewInit(): void {
		this.themeSubscription = this.theme.getJsTheme().pipe(
			delay(1),
			).subscribe(config => {
			// const colors = ['#000000', '#5793f3', '#d14a61', '#675bba'];
			const colors = config.variables;
			const echarts: any = config.variables.echarts;

			this.option = {
				backgroundColor: echarts.bg,
				color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
				title: [{
					text: '设备参数',
					x: '45%',
					y: '4%',
					textAlign: 'left',
					textStyle: {
						fontSize: 18,
						color: colors[0]
					},
				}, {
					text: '环境参数',
					x: '45%',
					y: '48%',
					textAlign: 'left',
					textStyle: {
						fontSize: 18,
						color: colors[0]
					},
				}],
				tooltip: {
					trigger: 'axis',
					showDelay: 0,
					axisPointer: {
						type: 'cross',//提示交叉线
						label: {
							backgroundColor: '#6a7985',
							fontSize: 18
						}
					},
					textStyle: {
						fontSize: 20,
					},
					position: function(pos, params, el, elRect, size) {//控制提示框位置
						var obj = { top: 10 };
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}

				},
				axisPointer: {
					link: { xAxisIndex: 'all' },//交叉线多个坐标轴共用
					label: {
						backgroundColor: '#777'
					}
				},
				toolbox: {
					show: true,
					feature: {
						mark: { show: true },
						dataView: { show: true, readOnly: false },
						restore: { show: true },
						saveAsImage: { show: true }
					}
				},
				dataZoom: {
					show: true,
					type: 'slider',
					xAxisIndex: [0, 1],//缩放区域同时控制多个坐标轴
					filterMode: 'filter'
				},
				legend: {
					textStyle: { fontSize: 18 },
					data: this.data && this.data.length > 0 ? this.data.map(item => item.name) : [],
				},
				grid: [{
					left: '10%',
					right: '20%',
					height: 200,
					bottom: 380
				}, {
					left: '10%',
					right: '20%',
					height: 200,
					bottom: 100
				}],
				xAxis: [
					{
						type: 'category',
						gridIndex: 0,
						splitNumber: 10,
						axisLabel: { show: false }
					},
					{
						type: 'category',
						gridIndex: 1,
						splitNumber: 10,
						axisLabel: {
							fontSize: 16,
						},
					}
				],
				yAxis: [
					{
						type: 'value',
						id: '未选择设备参数',
						name: '未选择设备参数',
						nameTextStyle: {
							fontSize: 16,
							verticalAlign: 'top',
							color: '#000000'
						},
						axisLabel: {
							formatter: function(v) {
								return v.toFixed(1)
							}
						},
					},
					{
						type: 'value',
						id: '未选择环境参数',
						name: '未选择环境参数',
						nameTextStyle: {
							fontSize: 16,
							verticalAlign: 'top',
							color: '#000000'
						},
						axisLabel: {
							formatter: function(v) {
								return v.toFixed(1)
							}
						},
						gridIndex: 1,

					}
				],
				animation: true,
				series: this.data && this.data.length > 0 ? this.data.map(item => {
					return {
						name: item.name,
						type: 'line',
						data: item.data,
						textStyle: { fontSize: 18 },
						showSymbol: false,
						sampling: 'average',
						showAllSymbol: false,
						markPoint: {
							data: [
								{ type: 'max', name: '最大值' },
								{ type: 'min', name: '最小值' }
							]
						},
					};
				}) : [],
			};

		});
	}

	ngOnDestroy() {
		if (this.themeSubscription) {
			this.themeSubscription.unsubscribe();
		}
	}

}
