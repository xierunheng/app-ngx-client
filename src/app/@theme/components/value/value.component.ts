import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { IValue } from '../../../@core/model/parameter';

@Component({
  selector: 'mes-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {
  @Input() vs: string[];
	@Input() value: IValue;
  @Input() showKey: boolean = false;
	@Output() valueChange = new EventEmitter<IValue>();

  constructor() { }

  ngOnInit() {

  }

  onValueChange(event) {
  	this.valueChange.emit(this.value);
  }

}
