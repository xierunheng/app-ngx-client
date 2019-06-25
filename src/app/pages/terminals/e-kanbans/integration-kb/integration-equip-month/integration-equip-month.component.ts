import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';

import { LineChartComponent } from '../integration-equip-week/charts/line-chart.component';
import { ColChartComponent} from '../integration-equip-week/charts/col-chart.component';
import { OrdersChart } from '../../../../../@core/data/orders-chart';
import { ProfitChart } from '../../../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../../@core/data/orders-profit-chart';

@Component({
  selector: 'mes-integration-equip-month',
  templateUrl: './integration-equip-month.component.html',
  styleUrls: ['./integration-equip-month.component.scss']
})
export class IntegrationEquipMonthComponent implements OnInit {
	private alive = true;

  /**
   * [生产过程的结束时间]
   * @type {Date}
   */
 // endTime: Date = moment().subtract(1, 'month').toDate();
  endTime: Date = new Date();
  /**
   * [过去一个月的起始时间]
   * @type {Date}
   */
  monthStartTime: Date = moment(this.endTime).subtract(1, 'month').toDate();

//	oeePanelSummary: OrderProfitChartSummary[];
	fzlPanelSummary: OrderProfitChartSummary[];
	//period: string = 'week';
	//period: string = '周';
	ordersChartData: OrdersChart;
	profitChartData: ProfitChart;

	@ViewChild('ordersChart') ordersChart: LineChartComponent;
//	@ViewChild('profitChart') profitChart: ColChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData) {
    this.init();
	  this.getOrdersChartData();             //曲线图数据 OEE
//	this.getProfitChartData();
  }

  ngOnInit() {
  }

  init(){

    // console.log('startTime',this.monthStartTime);
    // console.log('endTime',this.endTime);
    // let d = moment(this.endTime).format('DD');
    // let D = moment(this.endTime).format('ddd');
    // console.log('日', d);
    // console.log('星期', D);
    // let diff = moment(this.endTime).diff(moment(this.monthStartTime), 'day');
    // console.log(diff);
    
  	//工艺设备OEE panelSummary
  	// this.oeePanelSummary = [
  	//   {
   //      title: '本年',
   //      value: 74
  	//   },{
   //      title: '本月',
   //      value: 78
  	//   },{
   //      title: '本周',
   //      value: 70
  	//   },{
   //      title: '当班',
   //      value: 73
  	//   },
  	// ]

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
  	// this.ordersChartData = {
  	// //  chartLabel: ['Mon','','','','','','Tue','','','','','','Wed','','','','','','Thu','','','','','','Fri','','','','','','Sat','','','','','','Sun','','','','',''],
  	// //  chartLabel: ['Mon','','','','Tue','','','','Wed','','','','Thu','','','','Fri','','','','Sat','','','','Sun','','',''],
  	// //  chartLabel: ['Jan','','Feb','','Mar','','Apr','','May','','Jun','','Jul','','Aug','','Sep','','Oct','','Nov','','Dec',''],    //按一天2班，2个数据算，
  	//   chartLabel: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  	//   linesData: []
  	// }
    
    //有效负载率 初始化数据，计算公式：有效负载率 = 负载时间 / 运行时间，运行时间 = 负载时间+空转时间
  	// this.profitChartData = {
  	//   chartLabel: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],    
  	//   data: []
  	// }

  	//设备负荷率 初始化数据，计算公式：设备负荷率（有效负载率） = 负载时间 / 运行时间，运行时间 = 负载时间+空转时间
  	this.ordersChartData = {
  	  chartLabel: [],    
  	  linesData: []
  	}

    for(let i=this.monthStartTime;i<this.endTime;i =  moment(i).add(1, 'day').toDate()) {
      let t = moment(i).format('DD');
      this.ordersChartData.chartLabel.push(t);
    }
 //   console.log('chartLabel', this.ordersChartData.chartLabel);
  }

 //  changeTab(selectedTab) {
	// 	if (selectedTab.tabTitle === 'Profit') {
	// 		this.profitChart.resizeChart();
	// 	} else {
	// 		this.ordersChart.resizeChart();
	// 	}
	// }
  
  getOrdersChartData() {
 //  	let array=[58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72]
	// //	console.log(array);
	// 	let array1=[68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75]
	// 	let array2=[77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79]
	// 	let array3=[66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65]
	// 	let array4=[51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74]
	// 	this.ordersChartData.linesData.push(array);
	// 	this.ordersChartData.linesData.push(array1);
	// 	this.ordersChartData.linesData.push(array2);
	// 	this.ordersChartData.linesData.push(array3);
	// 	this.ordersChartData.linesData.push(array4);
    console.log(this.ordersChartData.chartLabel.length);
	  if(this.ordersChartData.chartLabel.length === 30) {
      let array= [58, 97, 88, 51, 88, 92, 83, 78, 85, 94, 80, 88, 58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 58, 37, 88, 51, 88, 92];
  
	//	console.log(array);
	  	let array1=[88, 77, 98, 55, 78, 42, 84, 78, 85, 94, 80, 88, 68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75, 88, 77, 98, 55, 78, 42];
	  	let array2=[77, 85, 68, 75, 86, 75, 93, 88, 75, 74, 86, 90, 77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79, 77, 85, 68, 75, 86, 75];
	  	let array3=[66, 74, 85, 75, 74, 77, 80, 66, 90, 84, 95, 86, 66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65, 66, 74, 85, 75, 74, 77];
	  	let array4=[51, 90, 76, 85, 68, 80, 73, 90, 86, 88, 76, 80, 51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74, 51, 90, 76, 85, 68, 80];
		//let array5=[];
	  	this.ordersChartData.linesData.push(array);
	  	this.ordersChartData.linesData.push(array1);
	  	this.ordersChartData.linesData.push(array2);
	  	this.ordersChartData.linesData.push(array3);
	  	this.ordersChartData.linesData.push(array4);
    } else if(this.ordersChartData.chartLabel.length === 31){
      let array= [58, 97, 88, 51, 88, 92, 83, 78, 85, 94, 80, 88, 58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 58, 37, 88, 51, 88, 92, 73];
  
  //  console.log(array);
      let array1=[88, 77, 98, 55, 78, 42, 84, 78, 85, 94, 80, 88, 68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75, 88, 77, 98, 55, 78, 42, 77];
      let array2=[77, 85, 68, 75, 86, 75, 93, 88, 75, 74, 86, 90, 77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79, 77, 85, 68, 75, 86, 75, 87];
      let array3=[66, 74, 85, 75, 74, 77, 80, 66, 90, 84, 95, 86, 66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65, 66, 74, 85, 75, 74, 77, 85];
      let array4=[51, 90, 76, 85, 68, 80, 73, 90, 86, 88, 76, 80, 51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74, 51, 90, 76, 85, 68, 80, 76];
    //let array5=[];
      this.ordersChartData.linesData.push(array);
      this.ordersChartData.linesData.push(array1);
      this.ordersChartData.linesData.push(array2);
      this.ordersChartData.linesData.push(array3);
      this.ordersChartData.linesData.push(array4);

    } else if(this.ordersChartData.chartLabel.length === 29){
      let array= [58, 97, 88, 51, 88, 92, 83, 78, 85, 94, 80, 88, 58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 58, 37, 88, 51, 88];
  
  //  console.log(array);
      let array1=[88, 77, 98, 55, 78, 42, 84, 78, 85, 94, 80, 88, 68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75, 88, 77, 98, 55, 78];
      let array2=[77, 85, 68, 75, 86, 75, 93, 88, 75, 74, 86, 90, 77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79, 77, 85, 68, 75, 86];
      let array3=[66, 74, 85, 75, 74, 77, 80, 66, 90, 84, 95, 86, 66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65, 66, 74, 85, 75, 74];
      let array4=[51, 90, 76, 85, 68, 80, 73, 90, 86, 88, 76, 80, 51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74, 51, 90, 76, 85, 68];
    //let array5=[];
      this.ordersChartData.linesData.push(array);
      this.ordersChartData.linesData.push(array1);
      this.ordersChartData.linesData.push(array2);
      this.ordersChartData.linesData.push(array3);
      this.ordersChartData.linesData.push(array4);
    } else {  //28天
      let array= [58, 97, 88, 51, 88, 92, 83, 78, 85, 94, 80, 88, 58, 37, 88, 51, 88, 92, 83, 74, 81, 78, 57, 72, 58, 37, 88, 51];
  
  //  console.log(array);
      let array1=[88, 77, 98, 55, 78, 42, 84, 78, 85, 94, 80, 88, 68, 77, 58, 55, 78, 82, 78, 74, 81, 76, 70, 75, 88, 77, 98, 55];
      let array2=[77, 85, 68, 75, 86, 75, 93, 88, 75, 74, 86, 90, 77, 75, 68, 75, 73, 75, 69, 70, 68, 70, 67, 79, 77, 85, 68, 75];
      let array3=[66, 74, 85, 75, 74, 77, 80, 66, 90, 84, 95, 86, 66, 74, 70, 75, 74, 77, 59, 74, 72, 64, 73, 65, 66, 74, 85, 75];
      let array4=[51, 90, 76, 85, 68, 80, 73, 90, 86, 88, 76, 80, 51, 60, 76, 65, 68, 72, 73, 69, 66, 72, 79, 74, 51, 90, 76, 85];
    //let array5=[];
      this.ordersChartData.linesData.push(array);
      this.ordersChartData.linesData.push(array1);
      this.ordersChartData.linesData.push(array2);
      this.ordersChartData.linesData.push(array3);
      this.ordersChartData.linesData.push(array4);
    }

  }


 //  getProfitChartData(){
 //  	let array= [58, 97, 88, 51, 88, 92, 83, 78, 85, 94, 80, 88];
	// //	console.log(array);
	// 	let array1=[88, 77, 98, 55, 78, 42, 84, 78, 85, 94, 80, 88];
	// 	let array2=[77, 85, 68, 75, 86, 75, 93, 88, 75, 74, 86, 90];
	// 	let array3=[66, 74, 85, 75, 74, 77, 80, 66, 90, 84, 95, 86];
	// 	let array4=[51, 90, 76, 85, 68, 80, 73, 90, 86, 88, 76, 80];
	// 	//let array5=[];
	// 	this.profitChartData.data.push(array);
	// 	this.profitChartData.data.push(array1);
	// 	this.profitChartData.data.push(array2);
	// 	this.profitChartData.data.push(array3);
	// 	this.profitChartData.data.push(array4);
	// 	//this.profitChartData.data.push(array5);
 //  }

  ngOnDestroy() {
		this.alive = false;
	}


}
