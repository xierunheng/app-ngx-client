import { Component, OnInit, Input } from '@angular/core';
import { PclassService } from '../../../../../@core/data/pclass.service';
import { EclassService } from '../../../../../@core/data/eclass.service';
import { MclassService } from '../../../../../@core/data/mclass.service';
import { EnclassService } from '../../../../../@core/data/enclass.service';
import { ProsegService } from '../../../../../@core/data/proseg.service';
import { KpiDefinitionService } from '../../../../../@core/data/kpi-def.service';


class HsItemType {
	oid: string;
	count: number;
}

@Component({
	selector: 'mes-hs-pop',
	templateUrl: './hs-pop.component.html',
	styleUrls: ['./hs-pop.component.scss']
})
export class HsPopComponent implements OnInit {

	/**
	 * [hs's name]
	 */
	@Input() name: string;

	_type: string;
	/**
	 * [pop's type]
	 */
	@Input() 
	set type(type: string) {
		this._type = type;
		console.log(this._type);
		this.getItems(type);
	}

	/**
	 * [待显示的本层级内容]
	 * @type {HsItemType[]}
	 */
	items: HsItemType[];

	/**
	 * [本层级的总数]
	 * @type {number}
	 */
	itemsCount: number;

	/**
	 * [待显示的子层级的内容]
	 * @type {HsItemType[]}
	 */
	subItems: HsItemType[];

	/**
	 * [子层级的总数]
	 * @type {number}
	 */
	subItemsCount: number;

	constructor(private pcService: PclassService,
		private ecService: EclassService,
		private mcService: MclassService,
		private encService: EnclassService,
		private psService: ProsegService,
		private kpidService: KpiDefinitionService ) {
	}

	ngOnInit() {

	}

	getItems(type: string): void {
		switch (type) {
			case "personnel":
				this.pcService.searchPclasss({'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: item.persons.length,
						};
					});
					console.log(this.items);
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				this.pcService.searchPclasssEncode({'hs.path': {$regex: this.name }}).subscribe(items => {
					this.subItems = items.map(item => {
						return {
							oid: item.oid,
							count: item.persons.length
						}
					});
					this.subItemsCount = this.subItems && this.subItems.length > 0 ?
						this.subItems.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				})
				break;
			case "equipment":
				this.ecService.searchEclasss({ 'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: item.equipments.length
						};
					});
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				this.ecService.searchEclasssEncode({'hs.path': {$regex: this.name }}).subscribe(items => {
					this.subItems = items.map(item => {
						return {
							oid: item.oid,
							count: item.equipments.length
						}
					});
					this.subItemsCount = this.subItems && this.subItems.length > 0 ?
						this.subItems.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				break;
			case "material":
				this.mcService.searchMclasss({ 'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: item.mdefs.length
						};
					});
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				this.mcService.searchMclasssEncode({'hs.path': {$regex: this.name }}).subscribe(items => {
					this.subItems = items.map(item => {
						return {
							oid: item.oid,
							count: item.mdefs.length
						}
					});
					this.subItemsCount = this.subItems && this.subItems.length > 0 ?
						this.subItems.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				break;
			case "energy":
				this.encService.searchEnclass({ 'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: item.endefs.length
						};
					});
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				this.encService.searchEnclassEncode({'hs.path': {$regex: this.name }}).subscribe(items => {
					this.subItems = items.map(item => {
						return {
							oid: item.oid,
							count: item.endefs.length
						}
					});
					this.subItemsCount = this.subItems && this.subItems.length > 0 ?
						this.subItems.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				break;
			case "proseg":
				this.psService.searchProsegs({ 'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: 1
						};
					});
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				this.psService.searchProsegsEncode({'hs.path': {$regex: this.name }}).subscribe(items => {
					this.subItems = items.map(item => {
						return {
							oid: item.oid,
							count: 1
						}
					});
					this.subItemsCount = this.subItems && this.subItems.length > 0 ?
						this.subItems.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				break;
			case "kpi":
				this.kpidService.searchKpiDefs({ 'hs.name': this.name }).subscribe(items => {
					this.items = items.map(item => {
						return {
							oid: item.oid,
							count: 1
						};
					});
					this.itemsCount = this.items && this.items.length > 0 ?
						this.items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
				});
				break;
			default:
				// code...
				break;
		}
	}

	onClick(item): void {
		console.log(item);
	}

}
