import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { EmaintDashboardComponent } from './emaint-dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { OutputCardComponent } from './output-card/output-card.component';
import { OutputFrontSideComponent } from './output-card/output-front-side/output-front-side.component';
import { OutputBackSideComponent } from './output-card/output-back-side/output-back-side.component';
import { OutputLiveUpdateChartComponent } from './output-card/output-front-side/output-live-update-chart.component';
import { OutputPieChartComponent } from './output-card/output-back-side/output-pie-chart.component';
import { TaktCardComponent } from './takt-card/takt-card.component';
import { TaktFrontSideComponent } from './takt-card/takt-front-side/takt-front-side.component';
import { TaktBackSideComponent } from './takt-card/takt-back-side/takt-back-side.component';
import { TaktLiveUpdateChartComponent } from './takt-card/takt-front-side/takt-live-update-chart.component';
import { TaktPieChartComponent } from './takt-card/takt-back-side/takt-pie-chart.component';
import { EmaintChartsPanelComponent } from './emaint-charts-panel/emaint-charts-panel.component';
import { ChartPanelHeaderComponent } from './emaint-charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './emaint-charts-panel/chart-panel-summary/chart-panel-summary.component';
import { EmaintQtyChartComponent } from './emaint-charts-panel/emaint-qty-chart/emaint-qty-chart.component';
import { EmaintQcChartComponent } from './emaint-charts-panel/emaint-qc-chart/emaint-qc-chart.component';
import { EmaintEventsComponent } from './emaint-events/emaint-events.component';
import { EmaintTemperatureComponent } from './emaint-temperature/emaint-temperature.component';
import { EmaintTemperatureDraggerComponent } from './emaint-temperature/emaint-temperature-dragger/emaint-temperature-dragger.component';
import { EmaintLocComponent } from './emaint-loc/emaint-loc.component';
import { EmaintRecordsComponent } from './emaint-records/emaint-records.component';
import { EmaintEnergyComponent } from './emaint-energy/emaint-energy.component';
import { EmaintProsegComponent } from './emaint-proseg/emaint-proseg.component';
import { EmaintWeatherComponent } from './emaint-weather/emaint-weather.component';
import { LegendChartComponent } from './legend-chart/legend-chart.component';
import { EmaintProgressComponent } from './emaint-progress/emaint-progress.component';
import { EmaintTrimComponent } from './emaint-proseg/emaint-trim/emaint-trim.component';
import { EmaintGlazeComponent } from './emaint-proseg/emaint-glaze/emaint-glaze.component';

@NgModule({
  declarations: [EmaintDashboardComponent,
  	StatusCardComponent,
  	OutputCardComponent,
  	OutputFrontSideComponent,
  	OutputBackSideComponent,
  	OutputLiveUpdateChartComponent,
  	OutputPieChartComponent,
  	TaktCardComponent,
  	TaktFrontSideComponent,
  	TaktBackSideComponent,
  	TaktLiveUpdateChartComponent,
  	TaktPieChartComponent,
  	EmaintChartsPanelComponent,
  	ChartPanelHeaderComponent,
  	ChartPanelSummaryComponent,
  	EmaintQtyChartComponent,
  	EmaintQcChartComponent,
  	EmaintEventsComponent,
  	EmaintTemperatureComponent,
  	EmaintTemperatureDraggerComponent,
  	EmaintLocComponent,
  	EmaintRecordsComponent,
  	EmaintEnergyComponent,
  	EmaintProsegComponent,
  	EmaintWeatherComponent,
  	LegendChartComponent,
  	EmaintProgressComponent,
  	EmaintTrimComponent,
  	EmaintGlazeComponent,
  ],
  imports: [
    CommonModule,
    NgxEchartsModule,
    ThemeModule,
  ]
})
export class EmaintDashboardModule { }
