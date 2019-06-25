import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mes-integration-equip-show',
  templateUrl: './integration-equip-show.component.html',
  styleUrls: ['./integration-equip-show.component.scss']
})
export class IntegrationEquipShowComponent implements OnInit {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;
  @Input() desc: string;
  constructor() { }

  ngOnInit() {
  }

}
