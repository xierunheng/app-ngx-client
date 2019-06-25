import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-output-card',
  templateUrl: './output-card.component.html',
  styleUrls: ['./output-card.component.scss']
})
export class OutputCardComponent implements OnInit {

  flipped = false;

  constructor() { }

  ngOnInit() {
  }
  
  toggleFlipView() {
    this.flipped = !this.flipped;
  }
}
