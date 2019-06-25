import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { UserActivityData, UserActive } from '../../../@core/data/user-activity';

@Component({
  selector: 'mes-i-prod-activity',
  templateUrl: './i-prod-activity.component.html',
  styleUrls: ['./i-prod-activity.component.scss']
})
export class IProdActivityComponent implements OnDestroy {

  private alive = true;

  userActivity: UserActive[] = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;

  constructor(private themeService: NbThemeService,
              private userActivityService: UserActivityData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });

    this.getUserActivity(this.type);
  }

  getUserActivity(period: string) {
    this.userActivityService.getUserActivityData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(userActivityData => {
        this.userActivity = userActivityData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
