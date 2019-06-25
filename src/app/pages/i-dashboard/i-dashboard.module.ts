import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { IDashboardComponent } from './i-dashboard.component';
import { IQcCardComponent } from './i-qc-card/i-qc-card.component';
import { IYieldCardComponent } from './i-yield-card/i-yield-card.component';
import { IChartsPanelComponent } from './i-charts-panel/i-charts-panel.component';
import { IThCardComponent } from './i-th-card/i-th-card.component';
import { ILocProductsComponent } from './i-loc-products/i-loc-products.component';
import { IProgressSectionComponent } from './i-progress-section/i-progress-section.component';
import { ILossAnalyticsComponent } from './i-loss-analytics/i-loss-analytics.component';
import { IProdActivityComponent } from './i-prod-activity/i-prod-activity.component';
import { IQcFrontSideComponent } from './i-qc-card/i-qc-front-side/i-qc-front-side.component';
import { IQcBackSideComponent } from './i-qc-card/i-qc-back-side/i-qc-back-side.component';
import { IQcBarAnimationChartComponent } from './i-qc-card/i-qc-front-side/i-qc-bar-animation-chart.component';
import { IQcAreaChartComponent } from './i-qc-card/i-qc-back-side/i-qc-area-chart.component';
import { IYieldFrontSideComponent } from './i-yield-card/i-yield-front-side/i-yield-front-side.component';
import { IYieldBackSideComponent } from './i-yield-card/i-yield-back-side/i-yield-back-side.component';
import { IYieldLiveUpdateChartComponent } from './i-yield-card/i-yield-front-side/i-yield-live-update-chart.component';
import { IYieldPieChartComponent } from './i-yield-card/i-yield-back-side/i-yield-pie-chart.component';
import { ChartPanelHeaderComponent } from './i-charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './i-charts-panel/chart-panel-summary/chart-panel-summary.component';
import { YieldChartComponent } from './i-charts-panel/charts/yield-chart.component';
import { QcChartComponent } from './i-charts-panel/charts/qc-chart.component';
import { IThCardsHeaderComponent } from './i-th-card/i-th-cards-header/i-th-cards-header.component';
import { IThFrontSideComponent } from './i-th-card/i-th-front-side/i-th-front-side.component';
import { IThBackSideComponent } from './i-th-card/i-th-back-side/i-th-back-side.component';
import { IThBarComponent } from './i-th-card/i-th-front-side/i-th-bar/i-th-bar.component';
import { IThBarChartComponent } from './i-th-card/i-th-back-side/i-th-bar-chart.component';
import { SlideOutComponent } from './slide-out/slide-out.component';
import { ECommerceLegendChartComponent } from './legend-chart/legend-chart.component';
import { ILocProductsChartComponent } from './i-loc-products/i-loc-products-chart/i-loc-products-chart.component';
import { ILocProductsMapComponent } from './i-loc-products/i-loc-products-map/i-loc-products-map.component';
import { ILossStatisticsComponent } from './i-loss-analytics/i-loss-statistics/i-loss-statistics.component';
import { ILossAnalyticsChartComponent } from './i-loss-analytics/i-loss-analytics-chart/i-loss-analytics-chart.component';

@NgModule({
  declarations: [IDashboardComponent,
  	IQcCardComponent,
  	IYieldCardComponent,
  	IChartsPanelComponent,
  	IThCardComponent,
  	ILocProductsComponent,
  	IProgressSectionComponent,
  	ILossAnalyticsComponent,
  	IProdActivityComponent,
  	IQcFrontSideComponent,
  	IQcBackSideComponent,
  	IQcBarAnimationChartComponent,
  	IQcAreaChartComponent,
  	IYieldFrontSideComponent,
  	IYieldBackSideComponent,
  	IYieldLiveUpdateChartComponent,
  	IYieldPieChartComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    YieldChartComponent,
    QcChartComponent,
    IThCardsHeaderComponent,
    IThFrontSideComponent,
    IThBackSideComponent,
    IThBarComponent,
    IThBarChartComponent,
    SlideOutComponent,
    ECommerceLegendChartComponent,
    ILocProductsChartComponent,
    ILocProductsMapComponent,
    ILossStatisticsComponent,
    ILossAnalyticsChartComponent,
    ],
  imports: [
    CommonModule,
    NgxEchartsModule,
    ThemeModule,
  ]
})
export class IDashboardModule { }
