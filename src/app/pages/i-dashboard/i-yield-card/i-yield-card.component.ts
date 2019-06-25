import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-i-yield-card',
  templateUrl: './i-yield-card.component.html',
  styleUrls: ['./i-yield-card.component.scss']
})
export class IYieldCardComponent implements OnInit {

	flipped = false;

  toggleFlipView() {
    this.flipped = !this.flipped;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
