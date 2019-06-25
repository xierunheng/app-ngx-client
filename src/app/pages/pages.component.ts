import { Component, OnInit } from '@angular/core';
import { HsService } from '../@core/data/hs.service';
import { ParameterService } from '../@core/data/parameter.service';
import { MENU_ITEMS } from './pages-menu';
import { MclassService } from '../@core/data/mclass.service';
import { MdefService } from '../@core/data/mdef.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {

	constructor(private hsService: HsService,
    private paraService: ParameterService,
    private mcService: MclassService,
    private mdService: MdefService) {

	}

  menu = MENU_ITEMS;

  ngOnInit(): void {
  	this.hsService.init();
    this.paraService.init();
    this.mcService.init();
    this.mdService.init();
  }
}
