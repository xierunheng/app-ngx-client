import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//for Auth component, 后续Auth单独抽出去，就不在需要以下两个了
import { RouterModule} from '@angular/router';
import { ToasterModule } from 'angular2-toaster';

import { TreeviewModule } from 'ngx-treeview';
import { Ng2SmartTableModule} from 'ng2-smart-table';

import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbListModule,
  NbToastrModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbBadgeModule,
} from '@nebular/theme';

import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  HeaderKbComponent,
  SearchInputComponent,
  ThemeSettingsComponent,
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  ThemeSwitcherComponent,
  ThemeSwitcherListComponent,
  ToggleSettingsButtonComponent,

  TerminalHeaderComponent,
  TerminalFooterComponent,
  MesAuthComponent,
  MesAuthBlockComponent,
  MesLoginComponent,
  MesLoginTerminalComponent,
  MesRegisterComponent,
  MesLogoutComponent,
  MesRequestPasswordComponent,
  MesResetPasswordComponent,
  TreeSelectComponent,
  TreeMultiSelectComponent,
  ValueComponent,
  QtyComponent,
  PropComponent,
  SmartTableComponent,
  // PopSmartTableComponent,
  ModalSmartTableComponent,
  OplogComponent,
  ImageUploadComponent,
  ProcessBarComponent,
  TimelineComponent
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
  EvaIconsPipe,
  OidPipe, TreeitemPipe, ZhStatePipe, ZhOpPipe
} from './pipes';
import {
  OneColumnLayoutComponent,
  SampleLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  KanbanComponent,
} from './layouts';
import { FieldExistsValidatorDirective,
  GroupExistsValidatorDirective,
  // MesPopoverDirective,
  MinDirective,
  MaxDirective,
} from './directives';

import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NgbModule,
  NbSecurityModule, // *nbIsGranted directive,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbListModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbBadgeModule,
];

const COMPONENTS = [
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  ThemeSwitcherComponent,
  ThemeSwitcherListComponent,
  HeaderComponent,
  HeaderKbComponent,
  FooterComponent,
  SearchInputComponent,
  ThemeSettingsComponent,
  OneColumnLayoutComponent,
  SampleLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  KanbanComponent,
  ToggleSettingsButtonComponent,

  //用不着Auth大的Component，只需要里面小的Component
  MesAuthComponent,
  MesAuthBlockComponent,
  MesLoginComponent,
  MesLoginTerminalComponent,
  MesRegisterComponent,
  MesLogoutComponent,
  MesRequestPasswordComponent,
  MesResetPasswordComponent,
  TreeSelectComponent,
  TreeMultiSelectComponent,
  ValueComponent,
  QtyComponent,
  PropComponent,
  SmartTableComponent,
  // PopSmartTableComponent,
  ModalSmartTableComponent,
  OplogComponent,
  // ImageUploadComponent,
  ProcessBarComponent,
  TimelineComponent
];

const ENTRY_COMPONENTS = [
  ThemeSwitcherListComponent,
  OplogComponent
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
  EvaIconsPipe,

  OidPipe,
  TreeitemPipe,
  ZhStatePipe,
  ZhOpPipe,
];

const DIRECTIVES = [
  FieldExistsValidatorDirective,
  GroupExistsValidatorDirective,
  // MesPopoverDirective,
  MinDirective,
  MaxDirective,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'corporate',  // 1. 默认主题，修改的地方
    },
    [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME ],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDatepickerModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbWindowModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers,
  ...NbChatModule.forRoot({
    messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
  }).providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES, RouterModule, ToasterModule, TreeviewModule.forRoot(), Ng2SmartTableModule],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, TreeviewModule, Ng2SmartTableModule],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
