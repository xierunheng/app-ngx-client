import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'mes-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  // @Input()dateValue:any;
  @Input() states: any;
  @Input() isCollapsed: boolean;

  constructor() {
    console.log(this.states)
  }

  ngOnInit() {
    console.log("传入的数据", this.states)
  }

}
