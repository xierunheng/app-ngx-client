import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mes-i-th-bar',
  templateUrl: './i-th-bar.component.html',
  styleUrls: ['./i-th-bar.component.scss']
})
export class IThBarComponent implements OnInit {

  @Input() barData: { prevDate: string; prevValue: number; nextDate: string; nextValue: number };
  @Input() successDelta: boolean;
  
  constructor() { }

  ngOnInit() {
  }

}
