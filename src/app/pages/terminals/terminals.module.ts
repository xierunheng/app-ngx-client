import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartsModule } from '../charts/charts.module';

import { TerminalsRoutingModule } from './terminals-routing.module';
import { TerminalsComponent } from './terminals.component';
import { EKanbansComponent } from './e-kanbans/e-kanbans.component';
import { UnitsComponent } from './units/units.component';
import { SmartComponent } from './smart/smart.component';
import { TerminalDefComponent } from './terminal-def/terminal-def.component';
import { TerminalDefInfoComponent } from './terminal-def/terminal-def-info/terminal-def-info.component';

import { MoldingComponent } from './units/molding/molding.component';
import { TerminalJobComponent } from './units/terminal-job/terminal-job.component';
import { GCComponent } from './units/gc/gc.component';
import { TestmodalComponent } from './units/gc/testmodal/testmodal.component';

import { QCComponent } from './units/qc/qc.component';
import { QcimodalComponent } from './units/qc/qcimodal/qcimodal.component';
import { WGModalComponent } from './units/qc/wgmodal/wgmodal.component';

import { PackingQCComponent } from './units/packingqc/packingqc.component';
import { PackingComponent } from './units/packing/packing.component';
import { RepairComponent } from './units/repair/repair.component';
import { InventoryComponent } from './units/inventory/inventory.component';

import { HeaderComponent } from './units/components/header/header.component';
import { TerminalAlertComponent } from './units/components/terminal-alert/terminal-alert.component';
import { TerminalErrComponent } from './units/components/terminal-err/terminal-err.component';
import { TerminalQcComponent } from './units/components/terminal-qc/terminal-qc.component';
import { TerminalScrapComponent } from './units/components/terminal-scrap/terminal-scrap.component';
import { TerminalWarningComponent } from './units/components/terminal-warning/terminal-warning.component';
import { TerminalRepairComponent } from './units/components/terminal-repair/terminal-repair.component';

import { TrackComponent } from './smart/track/track.component';
import { ForcemodalComponent } from './smart/track/forcemodal/forcemodal.component';

import { TotalKbComponent } from './e-kanbans/total-kb/total-kb.component';
import { FloorKbComponent } from './e-kanbans/floor-kb/floor-kb.component';
import { MoldingKbComponent } from './e-kanbans/molding-kb/molding-kb.component';
import { TrimmingKbComponent } from './e-kanbans/trimming-kb/trimming-kb.component';
import { GlazingKbComponent } from './e-kanbans/glazing-kb/glazing-kb.component';

import { EquipmentKbComponent } from './e-kanbans/equipment-kb/equipment-kb.component';
import { EmaintRecordsComponent } from './e-kanbans/equipment-kb/emaint-records/emaint-records.component';
import { EmaintLocComponent } from './e-kanbans/equipment-kb/emaint-loc/emaint-loc.component';
import { EmaintEventsComponent } from './e-kanbans/equipment-kb/emaint-events/emaint-events.component';

import { QualityKbComponent } from './e-kanbans/quality-kb/quality-kb.component';
import { InventoryKbComponent } from './e-kanbans/inventory-kb/inventory-kb.component';

import { QualityPieComponent } from './e-kanbans/components/quality-pie.component';
import { OutputBarComponent } from './e-kanbans/components/output-bar.component';
import { QcTotalStatisticsComponent } from './e-kanbans/quality-kb/qc-total-statistics/qc-total-statistics.component';
import { QcReasonStatisticsComponent } from './e-kanbans/quality-kb/qc-reason-statistics/qc-reason-statistics.component';
import { QcTrendComponent } from './e-kanbans/quality-kb/qc-trend/qc-trend.component';
import { KbTitleComponent } from './e-kanbans/components/kb-title/kb-title.component';
import { EmaintOutputComponent } from './e-kanbans/equipment-kb/emaint-output/emaint-output.component';
import { EmaintTotalComponent } from './e-kanbans/equipment-kb/emaint-total/emaint-total.component';
import { DashboardChartComponent } from './e-kanbans/equipment-kb/dashboard-chart/dashboard-chart.component';
import { QcTitleComponent } from './e-kanbans/quality-kb/qc-title/qc-title.component';
import { QcDataComponent } from './e-kanbans/quality-kb/qc-data/qc-data.component';
import { PresidentKbComponent } from './e-kanbans/president-kb/president-kb.component';
import { EquipmgtKbComponent } from './e-kanbans/equipmgt-kb/equipmgt-kb.component';
import { IntegrationKbComponent } from './e-kanbans/integration-kb/integration-kb.component';
import { IntegrationQtyDailyComponent } from './e-kanbans/integration-kb/integration-qty-daily/integration-qty-daily.component';
import { IntegrationQtyWeekComponent } from './e-kanbans/integration-kb/integration-qty-week/integration-qty-week.component';
import { IntegrationQtyMonthComponent } from './e-kanbans/integration-kb/integration-qty-month/integration-qty-month.component';
import { IntegrationQcDailyComponent } from './e-kanbans/integration-kb/integration-qc-daily/integration-qc-daily.component';
import { IntegrationQcWeekComponent } from './e-kanbans/integration-kb/integration-qc-week/integration-qc-week.component';
import { IntegrationQcMonthComponent } from './e-kanbans/integration-kb/integration-qc-month/integration-qc-month.component';
import { IntegrationEquipDailyComponent } from './e-kanbans/integration-kb/integration-equip-daily/integration-equip-daily.component';
import { IntegrationEquipWeekComponent } from './e-kanbans/integration-kb/integration-equip-week/integration-equip-week.component';
import { IntegrationEquipMonthComponent } from './e-kanbans/integration-kb/integration-equip-month/integration-equip-month.component';
import { IntegrationEnergyDailyComponent } from './e-kanbans/integration-kb/integration-energy-daily/integration-energy-daily.component';
import { IntegrationEnergyWeekComponent } from './e-kanbans/integration-kb/integration-energy-week/integration-energy-week.component';
import { IntegrationEnergyMonthComponent } from './e-kanbans/integration-kb/integration-energy-month/integration-energy-month.component';
import { IntegrationEquipShowComponent } from './e-kanbans/integration-kb/integration-equip-daily/integration-equip-show/integration-equip-show.component';
import { IntegrationQtyWeekFrontComponent } from './e-kanbans/integration-kb/integration-qty-week/integration-qty-week-front/integration-qty-week-front.component';
import { IntegrationQtyWeekBackComponent } from './e-kanbans/integration-kb/integration-qty-week/integration-qty-week-back/integration-qty-week-back.component';
import { IntegrationQtyMonthShowComponent } from './e-kanbans/integration-kb/integration-qty-month/integration-qty-month-show.component';

import { QtyBarComponent } from './e-kanbans/integration-kb/integration-qty-week/integration-qty-week-front/qty-bar/qty-bar.component';
import { ChartSummaryComponent } from './e-kanbans/integration-kb/integration-qty-month/chart-summary/chart-summary.component';
import { ChartPanelHeaderComponent } from './e-kanbans/integration-kb/integration-equip-week/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './e-kanbans/integration-kb/integration-equip-week/chart-panel-summary/chart-panel-summary.component';
import { LineChartComponent } from './e-kanbans/integration-kb/integration-equip-week/charts/line-chart.component';
import { ColChartComponent } from './e-kanbans/integration-kb/integration-equip-week/charts/col-chart.component';
import { ECommerceLegendChartComponent } from './e-kanbans/integration-kb/legend-chart/legend-chart.component';
import { EnergyConsumeComponent } from './e-kanbans/components/energy-consume/energy-consume.component';

const ENTRY_COMPONENTS = [
	TerminalDefInfoComponent,
	QcimodalComponent,
	WGModalComponent,
	TestmodalComponent,
	ForcemodalComponent,
];

@NgModule({
  declarations: [TerminalsComponent,
  	EKanbansComponent,
  	UnitsComponent,
  	SmartComponent,
  	TerminalDefComponent,
  	TerminalDefInfoComponent,
  	MoldingComponent,
  	QCComponent,
  	QcimodalComponent,
  	WGModalComponent,
  	GCComponent,
  	TestmodalComponent,
  	PackingQCComponent,
  	PackingComponent,
  	TerminalJobComponent,
  	RepairComponent,
  	InventoryComponent,
  	TrackComponent,
  	ForcemodalComponent,
  	TotalKbComponent,
  	FloorKbComponent,
  	MoldingKbComponent,
  	TrimmingKbComponent,
  	GlazingKbComponent,
  	EquipmentKbComponent,
  	QualityKbComponent,
  	InventoryKbComponent,
  	HeaderComponent,
  	TerminalAlertComponent,
  	TerminalErrComponent,
  	TerminalQcComponent,
  	TerminalScrapComponent,
  	TerminalWarningComponent,
  	TerminalRepairComponent,
  	QualityPieComponent,
  	OutputBarComponent,
  	QcTotalStatisticsComponent,
  	QcReasonStatisticsComponent,
  	QcTrendComponent,
    EmaintRecordsComponent,
    EmaintLocComponent,
    KbTitleComponent,
    EmaintEventsComponent,
    EmaintOutputComponent,
    EmaintTotalComponent,
    DashboardChartComponent,
    QcTitleComponent,
    QcDataComponent,
    PresidentKbComponent,
    EquipmgtKbComponent,
    IntegrationKbComponent,
    IntegrationQtyDailyComponent,
    IntegrationQtyWeekComponent,
    IntegrationQtyMonthComponent,
    IntegrationQcDailyComponent,
    IntegrationQcWeekComponent,
    IntegrationQcMonthComponent,
    IntegrationEquipDailyComponent,
    IntegrationEquipWeekComponent,
    IntegrationEquipMonthComponent,
    IntegrationEnergyDailyComponent,
    IntegrationEnergyWeekComponent,
    IntegrationEnergyMonthComponent,
    IntegrationEquipShowComponent,
    IntegrationQtyWeekFrontComponent,
    IntegrationQtyWeekBackComponent,
    IntegrationQtyMonthShowComponent,
    QtyBarComponent,
    ChartSummaryComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    LineChartComponent,
    ColChartComponent,
    ECommerceLegendChartComponent,
    EnergyConsumeComponent
  	],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    TerminalsRoutingModule,
    ChartsModule
  ],
  entryComponents: [
  	...ENTRY_COMPONENTS,
  ],
  exports:[KbTitleComponent, DashboardChartComponent]
})
export class TerminalsModule { }
