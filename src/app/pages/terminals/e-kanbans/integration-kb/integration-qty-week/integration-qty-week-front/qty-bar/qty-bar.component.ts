import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mes-qty-bar',
  templateUrl: './qty-bar.component.html',
  styleUrls: ['./qty-bar.component.scss']
})
export class QtyBarComponent implements OnInit {
  @Input() barData: { prevDate: string; prevValue: number; nextDate: string; nextValue: number };
  @Input() successDelta: boolean;
  constructor() { }

  ngOnInit() {
  }

}
