import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-kanban-layout',
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <mes-header-kb></mes-header-kb>
      </nb-layout-header>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
  styleUrls: ['./kanban.layout.scss']
})
export class KanbanComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
