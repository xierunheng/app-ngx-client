import { Component, OnInit,Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'mes-kb-title',
  templateUrl: './kb-title.component.html',
  styleUrls: ['./kb-title.component.scss']
})
export class KbTitleComponent implements OnInit {
  @Input() title:string;
  date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  constructor() { }

  ngOnInit() {
  }

}
