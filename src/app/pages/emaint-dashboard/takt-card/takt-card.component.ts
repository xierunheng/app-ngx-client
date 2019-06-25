import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mes-takt-card',
  templateUrl: './takt-card.component.html',
  styleUrls: ['./takt-card.component.scss']
})
export class TaktCardComponent implements OnInit {

  flipped = false;

  constructor() { }

  ngOnInit() {
  }
  
  toggleFlipView() {
    this.flipped = !this.flipped;
  }
}
