import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mes-status-card',
  template: `
    <nb-card (click)="on = !on" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon {{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ title }}</div>
        <div class="status">{{ on ? 'ON' : 'OFF' }}</div>
      </div>
    </nb-card>
  `,
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() on = true;

  constructor() { }

  ngOnInit() {
  }

}
