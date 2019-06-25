import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-terminals',
  template: `
     <ngx-kanban-layout>
      <router-outlet></router-outlet>
    </ngx-kanban-layout>
  `,
  styles: []
})
export class TerminalsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
