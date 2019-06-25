import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-alerts',
  template: `
     <router-outlet></router-outlet>
  `,
  styles: []
})
export class AlertsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
