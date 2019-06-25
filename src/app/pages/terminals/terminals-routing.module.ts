import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalsComponent } from './terminals.component';
import { EKanbansComponent } from './e-kanbans/e-kanbans.component';
import { UnitsComponent } from './units/units.component';
import { SmartComponent } from './smart/smart.component';
import { TerminalDefComponent } from './terminal-def/terminal-def.component';

import { MoldingComponent } from './units/molding/molding.component';
import { TerminalJobComponent } from './units/terminal-job/terminal-job.component';
import { GCComponent } from './units/gc/gc.component';

import { QCComponent } from './units/qc/qc.component';

import { PackingQCComponent } from './units/packingqc/packingqc.component';
import { PackingComponent } from './units/packing/packing.component';
import { RepairComponent } from './units/repair/repair.component';
import { InventoryComponent } from './units/inventory/inventory.component';

import { TrackComponent } from './smart/track/track.component';
import { ForcemodalComponent } from './smart/track/forcemodal/forcemodal.component';

import { TotalKbComponent } from './e-kanbans/total-kb/total-kb.component';
import { FloorKbComponent } from './e-kanbans/floor-kb/floor-kb.component';
import { MoldingKbComponent } from './e-kanbans/molding-kb/molding-kb.component';
import { TrimmingKbComponent } from './e-kanbans/trimming-kb/trimming-kb.component';
import { GlazingKbComponent } from './e-kanbans/glazing-kb/glazing-kb.component';

import { EquipmentKbComponent } from './e-kanbans/equipment-kb/equipment-kb.component';
import { QualityKbComponent } from './e-kanbans/quality-kb/quality-kb.component';
import { InventoryKbComponent } from './e-kanbans/inventory-kb/inventory-kb.component';
import { PresidentKbComponent } from './e-kanbans/president-kb/president-kb.component';
import { EquipmgtKbComponent } from './e-kanbans/equipmgt-kb/equipmgt-kb.component';
import { IntegrationKbComponent } from './e-kanbans/integration-kb/integration-kb.component';

const routes: Routes = [{
	path: '',
	component: TerminalsComponent,
	children: [{
		path: 'terminal-def',
		component: TerminalDefComponent
	}, {
		path: 'e-kanbans',
		component: EKanbansComponent
	}, {
		path: 'e-kanbans/integration',
		component: IntegrationKbComponent
	}, {
		path: 'e-kanbans/total',
		component: TotalKbComponent
	}, {
		path: 'e-kanbans/floor',
		component: FloorKbComponent
	}, {
		path: 'e-kanbans/molding',
		component: MoldingKbComponent
	}, {
		path: 'e-kanbans/trimming',
		component: TrimmingKbComponent
	}, {
		path: 'e-kanbans/glazing',
		component: GlazingKbComponent
	},
	{
		path: 'e-kanbans/equipment',
		component: EquipmentKbComponent
	}, {
		path: 'e-kanbans/equipManage',
		component: EquipmgtKbComponent
	},
	{
		path: 'e-kanbans/quality',
		component: QualityKbComponent
	},
	{
		path: 'e-kanbans/president',
		component: PresidentKbComponent
	},
	{
		path: 'e-kanbans/inventory',
		component: InventoryKbComponent
	},
	{
		path: 'units',
		component: UnitsComponent
	},
	{
		path: 'units/molding',
		component: MoldingComponent
	},
	{
		path: 'units/terminal-jobOrder',
		component: TerminalJobComponent
	},
	{
		path: 'units/gc',
		component: GCComponent
	},
	{
		path: 'units/qc',
		component: QCComponent
	},
	{
		path: 'units/packingqc',
		component: PackingQCComponent
	},
	{
		path: 'units/packing',
		component: PackingComponent
	},
	{
		path: 'units/repair',
		component: RepairComponent
	},
	{
		path: 'units/inventory',
		component: InventoryComponent
	},
	{
		path: 'smart',
		component: SmartComponent
	},
	{
		path: 'smart/track',
		component: TrackComponent
	},
	],
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TerminalsRoutingModule { }
