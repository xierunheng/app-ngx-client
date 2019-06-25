import { Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { TrafficList } from '../../../../../../@core/data/traffic-list';

@Component({
  selector: 'mes-integration-qty-week-front',
  templateUrl: './integration-qty-week-front.component.html',
  styleUrls: ['./integration-qty-week-front.component.scss']
})
export class IntegrationQtyWeekFrontComponent implements  OnDestroy {

  private alive = true;

  @Input() frontCardData: TrafficList;

  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  trackByDate(_, item) {
    return item.date;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}