import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { WorkData, MaterialData } from '../../../../@core/data/util.service';

@Component({
  selector: 'mes-trimming-kb',
  templateUrl: './trimming-kb.component.html',
  styleUrls: ['./trimming-kb.component.scss'],
  providers: [NgbCarouselConfig]
})
export class TrimmingKbComponent implements OnInit {
  //电子看板对应的工序的名称
  title: string = MaterialData.BodyOps.trim.name;
  //电子看板统计产量的body State
  bodyState: string = MaterialData.BodyOps.trim.state;
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
