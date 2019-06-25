import { Component, OnInit, Input } from '@angular/core';
import { IQuantity } from '../../../@core/model/common';

@Component({
  selector: 'mes-emaint-progress',
  templateUrl: './emaint-progress.component.html',
  styleUrls: ['./emaint-progress.component.scss']
})
export class EmaintProgressComponent implements OnInit {
	@Input() title: string;
  @Input() value: string;
  @Input() on = true;

  constructor() { }

  ngOnInit() {
  }

}
