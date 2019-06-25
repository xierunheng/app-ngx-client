import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {IWorkRequest} from "../../../@core/model/work-req";
import {WorkOrderOverviewService} from "./workOrderOverview.service";
import {LoadingIndicator,Mode} from "nativescript-loading-indicator";
import {RadAutoCompleteTextViewComponent} from "nativescript-ui-autocomplete/angular";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {TokenModel} from "nativescript-ui-autocomplete";
import * as _ from 'lodash';

@Component({
  selector: "mes-m-workOrderOverview",
  moduleId: module.id,
  templateUrl: "./workOrderOverview.component.html",
  styleUrls: ["./workOrderOverview.component.css"],
  providers: [WorkOrderOverviewService]
})
export class WorkOrderOverviewComponent implements OnInit,AfterViewInit{

  @ViewChild("autocomplete") autocomplete: RadAutoCompleteTextViewComponent;
  private _items: ObservableArray<TokenModel>;

  private indicator: LoadingIndicator;

  // items: Array<TokenModel> = new Array();

  //保存列表数据(根据过滤动态变动)
  workRequestList:IWorkRequest[] = [];
  //保存列表数据(完整数据)
  filterWorkRequestList:IWorkRequest[] = [];
  //保存用户选择的完整的查询条件
  queryArray:string[] = [];
  //保存用户当前输入的还不完整的查询条件
  stringQuery:string = '';


  constructor(
    private routerExtensions: RouterExtensions,
    private workOrderOverviewService:WorkOrderOverviewService
  ){
    this.indicator = new LoadingIndicator();
  }

  ngOnInit(): void {
    this.showLoaderNoBezel();
    this.workOrderOverviewService.getWorkRequests().subscribe(val=>{
      this.workRequestList = val;
      this.filterWorkRequestList = val;
      console.log(val,"workRequestList!!!");
      const items: Array<TokenModel> = new Array();
      for(let i=0;i<val.length;i++){
        items.push(new TokenModel(val[i].oid,null));
      }
      console.log(items,"items!!!");
      // this.dataItems = items;
      // this._items = items;
      this.autocomplete.autoCompleteTextView.loadSuggestionsAsync = function (text){
        return new Promise(function (resolve, reject){
          return resolve(items);
        });
      }
      this.hideIndicator();
    });

  }

  get dataItems(): ObservableArray<TokenModel> {
    return this._items;
  }

  //查询内容变动时触发
  public onTextChanged(args) {
    console.log(_.isEmpty(_.trim(args.text)),"args.text!!!");
    // _.trim(args.text);
    console.log("onTextChanged: " + args.text);

    //去除空格
    let filterObj = _.trim(args.text);
    //保存用户输入的字符串查询条件
    this.stringQuery = filterObj;
    if(!_.isEmpty(filterObj)){
      //将此次的字符串进行查询过滤
      let listArray = this.filterWorkRequestList.filter(val=>val.oid.includes(filterObj));
      this.workRequestList = listArray;
      //将之前查询条件的结果添加到数组中
      if(!_.isEmpty(this.queryArray)){
        let listArray = this.filterWorkRequestList.filter(val=>this.queryArray.includes(val.oid));
        this.workRequestList.push(...listArray);
      }
    }else{
      //将之前查询条件的结果添加到数组中
      if(!_.isEmpty(this.queryArray)){
        let listArray = this.filterWorkRequestList.filter(val=>this.queryArray.includes(val.oid));
        this.workRequestList.length = 0;//先清空数组再将数据加进去
        this.workRequestList.push(...listArray);
      }else{
        //无任何查询条件，展示全部数据
        this.workRequestList = this.filterWorkRequestList;
      }
    }
  }

  //在提供选项中添加某个选项时触发
  public onTokenAdded(args){
    console.log("onTokenAdded: " + args.text);
    if(!_.isEmpty(args.text)){
      if(!this.queryArray.includes(args.text)){
        this.queryArray.push(args.text);
        console.log(this.queryArray,"this.queryArray");
        let listArray = this.filterWorkRequestList.filter(val=>this.queryArray.includes(val.oid));
        this.workRequestList = listArray;
        console.log(this.workRequestList.length)
      }
    }
  }

  //删除某个已选条件时触发
  public onTokenRemoved(args){
    console.log("onTokenRemoved: " + args.text);
    let index = this.queryArray.indexOf(args.text);
    if(index > -1){
      //判断查询条件数组是否还存在查询条件，有则显示剩下查询条件查询的值；否则直接展示所有数据
      if(this.queryArray.length>0){
        let workRequestIndex = 0;//存储删除下标
        let exist = false;//判断是否存在删除的查询条件值
        this.workRequestList.map((item,index)=>{
          if(item.oid==args.text){
            workRequestIndex = index;
            exist = true;
            return;
          }
        });
        //如果存在则剔除出去
        if(exist){
          this.workRequestList.splice(workRequestIndex,1);
        }
      }else{
        if(_.isEmpty(this.stringQuery)){
          this.workRequestList = this.filterWorkRequestList;
        }
      }
      //最后从查询条件数组中删除出去
      this.queryArray.splice(index,1);
    }
  }

  public onDidAutoComplete(args){
    console.log("onDidAutoComplete: " + args.text);
  }

  onChartTap(oid) {
    this.routerExtensions.navigate([`/workOrderOverview/work-res/${oid}`]);
    // this.routerExtensions.navigate([`/workOrderOverview/work-res/${this.workRequestList[args.index].oid}`]);
  }

  onListTap(_id){
    this.routerExtensions.navigate([`/workOrderOverview/jobOrder/${_id}`]);
  }

  backToHome(): void {
    this.routerExtensions.back();
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

  ngAfterViewInit(): void {

  }

}
