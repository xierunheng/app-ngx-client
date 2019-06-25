import { Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-i-th-back-side',
  templateUrl: './i-th-back-side.component.html',
  styleUrls: ['./i-th-back-side.component.scss']
})
export class IThBackSideComponent implements OnDestroy {

  private alive = true;

  @Input() trafficBarData: any;

  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}