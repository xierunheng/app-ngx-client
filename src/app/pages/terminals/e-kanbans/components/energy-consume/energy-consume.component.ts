import { Component, OnInit } from '@angular/core';
import { IQuantity, Quantity} from '../../../../../@core/model/common';

@Component({
  selector: 'ngx-energy-consume',
  templateUrl: './energy-consume.component.html',
  styleUrls: ['./energy-consume.component.scss']
})
export class EnergyConsumeComponent implements OnInit {
	//综合能耗
	TolEnergy: IQuantity; 
	//单位综合能耗
	UnitEnergy: IQuantity;
	//天然气
	naturalGas:IQuantity;
	//电能
	ElectricEnergy: IQuantity;
	//成品产量
	qty:IQuantity;
	//天然气折算成标准煤的系数，其中油田天然气为1.3300 kgce/m3，气田天然气为1.2143 kgce/m3，此处用气田天然气系数
    nCoefficient: IQuantity;
    //电能折算成标准煤的系数为0.1229 kgce/kwh
    eCoefficient: IQuantity;
    //单件成品重量
    UnitWeight: IQuantity;

  constructor() { 
  }

  ngOnInit() {
  	this.init();
  }

  init() {
  	this.nCoefficient = {
    	quantity: 1.2143,
    	unit:'kgce/m3'
    };
    this.eCoefficient = {
    	quantity: 0.1229,
    	unit: 'kgce/kwh'
    };
  	this.UnitWeight = {
  		quantity: 0.007,
  		unit: 't/件'
  	};
  	this.naturalGas = {
  		quantity: 2378,
  		unit: 'm3'
  	};
  	this.ElectricEnergy = {
  		quantity: 1229,
  		unit: 'kwh'
  	};
  	this.qty = {
  		quantity: 222,
  		unit: '件'
  	};

  	//综合能耗 = 电能 * 电能折算系数 + 天然气 * 天然气折算系数
  	this.TolEnergy = {
  		quantity: this.ElectricEnergy.quantity * this.eCoefficient.quantity + this.naturalGas.quantity * this.nCoefficient.quantity,
  		unit: 'kgce'
  	};
  	console.log('TolEnergy', this.TolEnergy);
  	//单位综合能耗 = 综合能耗 / 成品产量 * 单件成品重量
  	this.UnitEnergy = {
  		quantity: Number((this.TolEnergy.quantity/(this.qty.quantity * this.UnitWeight.quantity)).toFixed(2)),
  		unit:'kgce/t'
  	};
  }

}
