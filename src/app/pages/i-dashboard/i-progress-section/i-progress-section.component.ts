import { Component, OnDestroy } from '@angular/core';
import { ProgressInfo, StatsProgressBarData } from '../../../@core/data/stats-progress-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-i-progress-section',
  templateUrl: './i-progress-section.component.html',
  styleUrls: ['./i-progress-section.component.scss']
})
export class IProgressSectionComponent implements OnDestroy {

  private alive = true;

  progressInfoData: any[] = [
    {
      title: '今日良品率',
      value: '85.92%',
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: '新增坯体',
      value: 2378,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    },
    {
      title: '新增能耗',
      value: 200,
      activeProgress: 55,
      description: 'Better than last week (55%)',
    },
  ];;

  constructor(private statsProgressBarService: StatsProgressBarData) {
    this.statsProgressBarService.getProgressInfoData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        // this.progressInfoData = data;
      });
  }

  ngOnDestroy() {
    this.alive = true;
  }
}
