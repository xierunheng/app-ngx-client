import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';
import { ScadaDataService } from '../../../@core/data/scadaData.service';

@Component({
  selector: 'mes-emaint-loc',
  templateUrl: './emaint-loc.component.html',
  styleUrls: ['./emaint-loc.component.scss']
})
export class EmaintLocComponent implements OnInit, OnDestroy {
  private alive = true;

  intervalSubscription: Subscription;
  currentTheme: string;
  /**
   * [15个产线马桶工位标号、当前编号、当前型号]
   */
  locs: any[];

  constructor(private location: Location,
    private themeService: NbThemeService,
    private scadaService: ScadaDataService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.scadaService.getProctionsCode().subscribe(data => {
      this.locs = data;
      this.startReceivingLiveData();
    });
  }

  startReceivingLiveData() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(30 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.scadaService.getProctionsCode()),
      ).subscribe(data => {
        this.locs = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
