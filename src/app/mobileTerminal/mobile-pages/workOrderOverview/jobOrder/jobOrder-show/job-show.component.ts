import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {EchartBar, IJobResponse} from "../../../../../@core/model/job-response";
import {IJobOrder} from "../../../../../@core/model/job-order";
import {IQuantity, Quantity} from "../../../../../@core/model/common";
import {WorkData} from "../../../../../@core/data/util.service";
import {RouterExtensions} from "nativescript-angular";
import {RadialBarIndicator, RadialScale} from "nativescript-ui-gauge";
import {JobOrderService} from "./job-order.service";
import {JobResponseService} from "./job-response.service";
import {LoadingIndicator, Mode} from "nativescript-loading-indicator";

@Component({
	selector: 'mes-m-job-show',
	templateUrl: './job-show.component.html',
	styleUrls: ['./job-show.component.css'],
  providers:[JobOrderService,JobResponseService]
})
export class JobShowComponent implements OnInit,AfterViewChecked {

  @ViewChild("myScale") scaleElement: ElementRef;
  @ViewChild("myScale1") scaleElement1: ElementRef;

	//产出的可选的呈现类型
	qtyTypes: string[] = ['仅物料', '物料+成型工'];

	//产出呈现的类型
	qtyType: string = this.qtyTypes[0];
	
	/**
	 * [jobOrder response]
	 * @type {JobResponse}
	 */
	jr: IJobResponse;

	/**
	 * [jobOrder order]
	 * @type {JobOrder}
	 */
	jo: IJobOrder;

	//工单的产出，方便 echart 呈现, 带Title
	output: EchartBar;

	//工单生产的总数，包括合格的和不合格的
	totalQty: IQuantity;

  /**
   * [工单的进度值]
   * @type {number}
   */
	processValue: number = 0;

	//进度条文本
  processText:string = '';

  //进度条样式
  persentStyle:string = "";

  //本工单产量subtitle
  processSubtitle:string = "";

  //缺陷率
  qPer = 0;
  //缺陷率title
  qTitle = "";
  //缺陷率subtitle
  qSubtitle = "";

  private indicator: LoadingIndicator;

	constructor(
	  private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private joService: JobOrderService,
		private jrService: JobResponseService,
    private routerExtensions: RouterExtensions,
              ) {
    this.indicator = new LoadingIndicator();
  }


	ngOnInit() {
		this.showLoaderNoBezel();
		let oid = this.route.snapshot.paramMap.get('oid');
		this.joService.getJobOrderNo404({ oid: oid }).subscribe(jo => {
			this.jo = jo;
			this.jrService.getJobResponseNo404({ oid: oid }).subscribe(jr => {
				this.jr = jr;
				this.init();
				this.hideIndicator();
			})
		})
	}

	init(): void {
		if (this.jo && this.jr) {
			this.jo.qty = new Quantity();
			this.jo.qty.quantity = this.jo.mReq.map(mr => mr.qty.quantity).reduce((prev, curr) => prev + curr);
			this.totalQty = {
				quantity: this.jr.ngqty.quantity + this.jr.qty.quantity,
				unit: this.jr.qty.unit
			};
			this.processValue = this.jo.qty.quantity === 0 ? 0 : _.round(this.jr.qty.quantity / this.jo.qty.quantity * 100, 2);
      this.processText = "完成率"+this.processValue+"%";
      this.persentStyle = "background:linear-gradient(to right, #07C160 " + this.processValue + "%,#d9f7be)";
      this.processSubtitle = this.jr.qty.quantity+"/"+this.jo.qty.quantity+this.jr.qty.unit;
      this.qPer = this.jr.ngqty.quantity===0?0:_.round(this.jr.ngqty.quantity/this.totalQty.quantity*100,2);
      this.qTitle = "缺陷率"+this.qPer+"%";
      this.qSubtitle = this.jr.ngqty.quantity+"/"+this.totalQty.quantity+this.jr.qty.unit;
		}
	}

  public showLoaderNoBezel() {
    this.indicator.show({
      message: '正在加载中...',
      // mode: Mode.Determinate ,
      ios: {
        color: '#000',
        hideBezel: true
      },
      android: {
        // max:20,
        details: "Additional detail note!",
        // margin: 10,//loading标签往上走
        dimBackground: true,//是否全屏灰暗滤镜
        square: true,//是否为方形
        color: '#000',//标签和字体颜色
        backgroundColor: "green",//背景颜色,当hideBezel为true时生效
        userInteractionEnabled: true, // default true. Set false so that the touches will fall through it.
        hideBezel: true, // default false, can hide the surrounding bezel
        mode: Mode.CustomView ,// see options below
        indeterminate: true,
        // cancelable: true,
        customView: 'icon.png'//mode模式为Mode.CustomView是才生效,自定义loading图片
      }
    });
  }

  private hideIndicator(){
    this.indicator.hide();
  }

  /**
   * [返回上一级]
   */
  backToJobOrder(): void {
    this.routerExtensions.back();
	}

  ngAfterViewChecked(): void {
    //完成率
    let scale = this.scaleElement.nativeElement as RadialScale;
    for (let i = 0; i < scale.indicators.length; i++) {
      let barIndicator = scale.indicators.getItem(i) as RadialBarIndicator;
      if (barIndicator.maximum === 0) {
        barIndicator.maximum = this.processValue;
      }
    }
    //缺陷率
    let scale1 = this.scaleElement1.nativeElement as RadialScale;
    for (let i = 0; i < scale1.indicators.length; i++) {
      let barIndicator = scale1.indicators.getItem(i) as RadialBarIndicator;
      if (barIndicator.maximum === 0) {
        barIndicator.maximum = this.qPer;
      }
    }
  }
}
