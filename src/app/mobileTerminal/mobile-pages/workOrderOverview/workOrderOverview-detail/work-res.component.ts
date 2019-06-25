import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  AfterContentInit
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular";
import {IWork, IWorkResponse} from "../../../../@core/model/work-res";
import {WorkResponseService} from "./work-res.service";
import {RadialBarIndicator, RadialScale} from "nativescript-ui-gauge";
import {MaterialData} from "../../../../@core/data/util.service";
import {IWorkRequest} from "../../../../@core/model/work-req";
import {IQuantity} from "../../../../@core/model/common";
import * as _ from 'lodash';
import {IJobOrder} from "../../../../@core/model/job-order";
import {IJobResponse} from "../../../../@core/model/job-response";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {LoadingIndicator,Mode} from "nativescript-loading-indicator";

class EchartQtyItem {
  oid: string;
  name: string;
  stack: string;
  quantity: number;
}

@Component({
  selector: "mes-m-work-res",
  moduleId: module.id,
  templateUrl: "./work-res.component.html",
  styleUrls: ["./work-res.component.css"],
  providers: [WorkResponseService]
})
export class WorkResComponent implements OnInit,AfterViewInit ,AfterViewChecked{

  @ViewChild("myScale") scaleElement: ElementRef;
  @ViewChild("myScale1") scaleElement1: ElementRef;

  oid: string = '';
  work: IWork;
  wres: IWorkResponse;
  wreq: IWorkRequest;
  /**
   * [每一个 jobOrder 的 进程]
   * @return {number[]} [description]
   */
  processValues: any;

  /**
   * [作业的进度值]
   */
  processValue: number = 0;

  //首工序生产数量
  firstPQ: IQuantity;
  //尾工序成品数量
  lastGQ: IQuantity;
  //工单计划生产数量
  POQ: IQuantity;
  //作业总缺陷数
  SQ: IQuantity;
  //进度条样式
  persentStyle = "";
  //本作业产量subtitle
  processSubtitle = '';
  //作业进度完成率text
  processText="";
  //缺陷率
  qPer = 0;
  //缺陷率title
  qTitle = "";
  //缺陷率subtitle
  qSubtitle = "";
  //
  jobs:any[]=[];
  //
  type: string = '仅物料';

  private indicator: LoadingIndicator;

  constructor(
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private workResponseService: WorkResponseService,
    private ngZone:NgZone
  ) {
    this.indicator = new LoadingIndicator();
  }

  ngOnInit(): void {
    this.showLoaderNoBezel();
    this.ngZone.run(() => {
      this.oid = this.route.snapshot.params.oid;
      this.workResponseService.getWork({oid: this.oid}).subscribe(work => {
        this.wreq = work.wreq;
        this.wres = work.wres;
        this.init();
        this.hideIndicator();
      });
    });
  }

  //显示加载loading
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

  backToWorkOrder(): void {
    this.routerExtensions.back();
  }

  confirm(even) {
  }

  cancel(even) {
  }

  ngAfterViewInit(): void {

  }

  init(): void {
    if (this.wres && this.wreq) {
      let firstJr = this.wres.jobResponse.find(item => item.oid === this.wres.firstJob.oid);
      this.firstPQ = {
        quantity: firstJr.qty.quantity + firstJr.ngqty.quantity,
        unit: firstJr.qty.unit,
      };
      let lastJr = this.wres.jobResponse.find(item => item.oid === this.wres.lastJob.oid);
      this.lastGQ = {
        quantity: lastJr.qty.quantity,
        unit: lastJr.qty.unit
      };
      console.log(this.lastGQ,'lastGQ!!!')
      let lastJo = this.wreq.jobOrder.find(item => item.oid === this.wreq.lastJob.oid);
      this.POQ = {
        quantity: lastJo.mReq.map(item => item.qty.quantity).reduce((prev, curr) => prev + curr),
        unit: lastJo.mReq[0].qty.unit
      };
      console.log(this.POQ,'POQ!!!')
      this.SQ = {
        quantity: this.wres.jobResponse.map(item => item.ngqty.quantity).reduce((prev, curr) => prev + curr),
        unit: lastJo.mReq[0].qty.unit
      };

      this.processValue = this.POQ.quantity === 0 ? 0 : _.round(this.lastGQ.quantity / this.POQ.quantity * 100, 2)
      let jobArray = [];
      this.processValues = this.wres.jobResponse
        .filter(jr => jr.directive.proseg.oid !== '成型')
        .sort((a, b) => Number(a.directive.proseg.no) - Number(b.directive.proseg.no))
        .map(jr => {
          let jo = this.wreq.jobOrder.find(jo => jo._id === jr.jobOrder._id);
          let destReq = jo.mReq.filter(item => item.use === MaterialData.useTypes[1]);
          if(!destReq || destReq.length <= 0) {
            destReq = jo.mReq.filter(item => item.use === MaterialData.useTypes[0]);
          }

          //作业产出初始化和作业缺陷率初始化->工单和工单响应
          let job = {jr:jr,jo:jo};
          jobArray.push(job);

          // this.jobQtyInit();

          return {
            oid: jr.oid,
            qty: {
              quantity: destReq.map(item => item.qty.quantity).reduce((prev, curr) => prev + curr),
              unit: destReq[0].qty.unit
            },
            actQty: jr.qty
          };
        });
      this.jobs = jobArray;
      console.log(this.jobs.length,"this.jobs!!!!!!!!!!!!");

      console.log(this.processValue,'123123123!!!');
      this.processText = "完成率"+this.processValue+"%";
      this.processSubtitle = this.lastGQ.quantity+"/"+this.POQ.quantity+this.lastGQ.unit;
      this.persentStyle = "background:linear-gradient(to right, #07C160 " + this.processValue + "%,#d9f7be)";
      this.qPer = this.SQ.quantity===0?0:_.round(this.SQ.quantity/this.firstPQ.quantity*100,2);
      this.qTitle = "缺陷率"+this.qPer+"%";
      this.qSubtitle = this.SQ.quantity+"/"+this.firstPQ.quantity+this.SQ.unit;
    }
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
