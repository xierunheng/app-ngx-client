import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';

import { LineChartComponent } from './charts/line-chart.component';
import { ColChartComponent} from './charts/col-chart.component';
import { OrdersChart } from '../../../../../@core/data/orders-chart';
import { ProfitChart } from '../../../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../../@core/data/orders-profit-chart';

@Component({
  selector: 'mes-integration-equip-week',
  templateUrl: './integration-equip-week.component.html',
  styleUrls: ['./integration-equip-week.component.scss']
})
export class IntegrationEquipWeekComponent implements OnInit, OnDestroy {
  private alive = true;

   /**
   * [生产过程的结束时间]
   * @type {Date}
   */
 // endTime: Date = moment().subtract(1, 'month').toDate();
  endTime: Date = new Date();
  /**
   * [过去一个星期的起始时间]
   * @type {Date}
   */
  monthStartTime: Date = moment(this.endTime).subtract(7, 'day').toDate();

	oeePanelSummary: OrderProfitChartSummary[];
	fzlPanelSummary: OrderProfitChartSummary[];
	//period: string = 'week';
	//period: string = '周';
	ordersChartData: OrdersChart;
	profitChartData: ProfitChart;

	@ViewChild('ordersChart') ordersChart: LineChartComponent;
	@ViewChild('profitChart') profitChart: ColChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData) {
    this.init();
	this.getOrdersChartData();             //曲线图数据 OEE
	this.getProfitChartData();
	//this.getProfitChartData(this.period);
  }

  ngOnInit() {
  	
  }

  init(){
  	//工艺设备OEE panelSummary
  	this.oeePanelSummary = [
  	  {
        title: '本年',
        value: 74
  	  },{
        title: '本月',
        value: 78
  	  },{
        title: '本周',
        value: 70
  	  },{
        title: '当班',
        value: 73
  	  },
  	]

    //有效负载率 panelSummary
  	this.fzlPanelSummary = [
  	  {
        title: '本年',
        value: 81
  	  },{
        title: '本月',
        value: 90
  	  },{
        title: '本周',
        value: 95
  	  },{
        title: '当班',
        value: 73
  	  },
  	]
    
    //工艺设备OEE 初始化数据，计算公式： OEE = 合格成品数量 / (生产时间*标准生产率) = 合格成品数量 / (生产时间/标准节拍)
  	this.ordersChartData = {
  	//  chartLabel: ['Mon','','','','','','Tue','','','','','','Wed','','','','','','Thu','','','','','','Fri','','','','','','Sat','','','','','','Sun','','','','',''],
  	//  chartLabel: ['Mon','','','','Tue','','','','Wed','','','','Thu','','','','Fri','','','','Sat','','','','Sun','','',''],
  	  chartLabel: ['Mon','','Tue','','Wed','','Thu','','Fri','','Sat','','Sun','',],    //按一天2班，2个数据算，
  	  linesData: []
  	}
    
    //有效负载率 初始化数据，计算公式：有效负载率 = 负载时间 / 运行时间，运行时间 = 负载时间+空转时间
  	this.profitChartData = {
  	//  chartLabel: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  	  chartLabel: [],    
  	  data: []
  	}

  	for(let i=this.monthStartTime;i<this.endTime;i =  moment(i).add(1, 'day').toDate()) {
      let t = moment(i).format('ddd');
      this.profitChartData.chartLabel.push(t);
    }
   // console.log('chartLabel 周', this.profitChartData.chartLabel);

  }

 //  setPeriodAndGetChartData(value: string): void {
	// 	if (this.period !== value) {
	// 		this.period = value;
	// 	}

	// 	this.getOrdersChartData(value);  
	// 	this.getProfitChartData(value);  
	// }

	changeTab(selectedTab) {
		if (selectedTab.tabTitle === 'Profit') {
			this.profitChart.resizeChart();
		} else {
			this.ordersChart.resizeChart();
		}
	}

	getOrdersChartData() {
		let array=[58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 87, 54]
	//	console.log(array);
		let array1=[68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75, 77, 69]
		let array2=[77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79, 72, 77]
		let array3=[66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65, 77, 73]
		let array4=[51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74, 59, 70]
		this.ordersChartData.linesData.push(array);
		this.ordersChartData.linesData.push(array1);
		this.ordersChartData.linesData.push(array2);
		this.ordersChartData.linesData.push(array3);
		this.ordersChartData.linesData.push(array4);
		// this.ordersProfitChartService.getOrdersChartData(period)
		// 	.pipe(takeWhile(() => this.alive))
		// 	.subscribe(ordersChartData => {
		// 		this.ordersChartData = ordersChartData;

		// 		console.log('ordersChartData',this.ordersChartData)
		// 		// let array=[58, 37]
		// 		let array=[58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 87, 54, 64, 80, 81, 68, 61, 58,
		// 		    61, 69, 80, 96, 75, 77, 61, 86, 80, 73, 74, 71, 84, 83, 77, 77, 77, 77, 77, 67, 87, 67, 67]
		// 		console.log(array);
		// 		let array2=[68, 77, 58, 55, 78, 82, 83, 74, 81, 76, 67, 72, 77, 64, 64, 80, 77, 68, 61, 66,
		// 		    61, 69, 80, 76, 75, 77, 61, 80, 80, 73, 74, 71, 74, 79, 77, 75, 76, 77, 74, 67, 77, 67, 67]
		// 		this.ordersChartData.linesData.push(array);
		// 		this.ordersChartData.linesData.push(array2);
		// 		console.log('ordersChartData2',this.ordersChartData)
		// 	});
	}

	getProfitChartData() {
		// this.ordersProfitChartService.getProfitChartData(period)
		// 	.pipe(takeWhile(() => this.alive))
		// 	.subscribe(profitChartData => {
		// 		this.profitChartData = profitChartData;
		// 		console.log('profitChartData', this.profitChartData)
		// 	});
	    let array= [58, 97, 88, 51, 88, 92, 83];
	//	console.log(array);
		let array1=[88, 77, 98, 55, 78, 42, 84];
		let array2=[77, 85, 68, 75, 86, 75, 93];
		let array3=[66, 74, 85, 75, 74, 77, 80];
		let array4=[51, 90, 76, 85, 68, 80, 73];
	//	let array5=[];
		this.profitChartData.data.push(array);
		this.profitChartData.data.push(array1);
		this.profitChartData.data.push(array2);
		this.profitChartData.data.push(array3);
		this.profitChartData.data.push(array4);
	//	this.profitChartData.data.push(array5);
	}

	ngOnDestroy() {
		this.alive = false;
	}

}
