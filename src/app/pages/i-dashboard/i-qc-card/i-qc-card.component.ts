import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-i-qc-card',
  templateUrl: './i-qc-card.component.html',
  styleUrls: ['./i-qc-card.component.scss']
})
export class IQcCardComponent implements OnInit {
  flipped = false;

  toggleView() {
    this.flipped = !this.flipped;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
