import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mes-chart-panel-summary',
  template: `
    <div class="summary-container">
      <div class="summory" *ngFor="let item of summary">
        <div class="title">{{ item.title }}</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./chart-panel-summary.component.scss']
})
export class ChartPanelSummaryComponent implements OnInit {
  @Input() summary: {title: string; value: number}[];
  
  constructor() { }

  ngOnInit() {
  }

}
