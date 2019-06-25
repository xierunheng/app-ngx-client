import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { WorkData, MaterialData } from '../../../../@core/data/util.service';

@Component({
  selector: 'glazing-kb',
  templateUrl: './glazing-kb.component.html',
  styleUrls: ['./glazing-kb.component.scss'],
  providers: [NgbCarouselConfig]
})
export class GlazingKbComponent implements OnInit {
  //电子看板对应的工序的名称
  title: string = MaterialData.BodyOps.glaze.name;
  //电子看板统计产量的body State
  bodyState: string = MaterialData.BodyOps.glaze.state;
  //质量缺陷项的状态
  ngState: string = MaterialData.BodyOps.reject.state;

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    // config.wrap = false;
    // config.keyboard = false;
  }

  ngOnInit() {
  }

}
