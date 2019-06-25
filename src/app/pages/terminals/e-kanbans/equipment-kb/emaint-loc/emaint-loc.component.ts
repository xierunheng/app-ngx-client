import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NbThemeService } from '@nebular/theme';
import { ScadaDataService } from '../../../../../@core/data/scadaData.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-emaint-loc',
  templateUrl: './emaint-loc.component.html',
  styleUrls: ['./emaint-loc.component.scss']
})
export class EmaintLocComponent implements OnInit {
  private alive = true;

  /**
   * [15个产线马桶工位标号、当前编号、当前型号]
   */
  locs: any[];

  constructor(private location: Location,
    private themeService: NbThemeService,
    private scadaService: ScadaDataService) {
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.scadaService.getProctionsCode().subscribe(data => {
          this.locs = data;
        });
      });
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.init();
    }, 20 * 1000);
  }

}
