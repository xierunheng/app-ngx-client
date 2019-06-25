// //y轴的数值
// export interface ISerizeData {
//   name:string,
//   type:string,
//   data:string[],
//   stack:string,//设置以叠柱的形式显示
// }

// export interface IyAxisData {
//   name:string,//y轴名
//   id:string,//默认是根据y轴的index顺序对应series的数据，随机性大，所以采用id设置对应关系
//   fomatter:string,//刻度显示方式，eg'25ml'
// }

// export interface IEchartData {
//   titleText:string,
//   titleSubtext:string,

//   legendData:string[],
//   xData:string[],
//   series:ISerizeData[],
//   yAxis:IyAxisData[],

// }

// export class serizeData {
//   public name:string;
//   public type:string;
//   public stack:string;
//   public itemStyle:any;
//   public data:number[];
//   constructor(argument) {
//     this.name = "";
//     this.type= "";
//     this.stack= "";
//     this.itemStyle= { normal: { label: { show: true, position: 'insideTop' } } },
//     this.data=[];
//   }
// }
export class EchartPieData {
  titleText: string;
  legendData: string[];
  series: any[];
}

export class EchartBarData {
  titleText: string;
  legendData: string[];
  xData: string[];
  series: any[];
}

//自定义echart组件的局部样式
export class OptionSet {
    public options:any;
    public fontSize:number;
    constructor(){
       this.options={};
       this.fontSize = 20;
    }

}


// options为标准的option设置
// fontSize为统一的字体大小设置
export interface IOptionSet {
    options:any;
    fontSize:number;
}

