import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';

import {AppRoutingModule} from './app-routing.module.tns';
import {AppComponent} from './app.component';
import {AutoGeneratedComponent} from './auto-generated/auto-generated.component';
import {NativeScriptHttpClientModule} from "nativescript-angular/http-client";
import {LoginComponent} from "./mobileTerminal/mobile-pages/login/login.component";
import {NativeScriptFormsModule} from "nativescript-angular";
import {UserService} from "./mobileTerminal/mobile-pages/login/user.service";
import {BarcodescannerComponent} from "./mobileTerminal/mobile-pages/barcodescanner/barcodescanner.component";
import {NativeScriptUISideDrawerModule} from "nativescript-ui-sidedrawer/angular";
import {NativeScriptUIListViewModule} from "nativescript-ui-listview/angular";
import {NativeScriptUICalendarModule} from "nativescript-ui-calendar/angular";
import {NativeScriptUIChartModule} from "nativescript-ui-chart/angular";
import {NativeScriptUIDataFormModule} from "nativescript-ui-dataform/angular";
import {NativeScriptUIAutoCompleteTextViewModule} from "nativescript-ui-autocomplete/angular";
import {NativeScriptUIGaugeModule} from "nativescript-ui-gauge/angular";
import {NativeScriptCommonModule} from "nativescript-angular/common";
import {HomeComponent} from "./mobileTerminal/mobile-pages/home/home.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LocalnotificationComponent} from "./mobileTerminal/mobile-pages/localnotification/localnotification.component";
import {WorkalertComponent} from "./mobileTerminal/mobile-pages/workalert/workalert.component";
import {MsubLotService} from "./mobileTerminal/mobile-pages/barcodescanner/msublot.service";
import {WorkalertDetailComponent} from "./mobileTerminal/mobile-pages/workalert/workalert-detail/workalert-detail.component";
import {PmHomeComponent} from "./mobileTerminal/mobile-pages/productionManagement/pmHome.component";
import {EmHomeComponent} from "./mobileTerminal/mobile-pages/equipmentManagement/emHome.component";
import {WmHomeComponent} from "./mobileTerminal/mobile-pages/warningManagement/wmHome.component";
import {WorkOrderOverviewComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview.component";
import {WorkResComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview-detail/work-res.component";
import {JobShowQtyComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview-detail/job-show-qty/job-show-qty.component";
import {JobShowQciComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview-detail/job-show-qci/job-show-qci.component";
import {JobOrderComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/jobOrder/jobOrder.component";
import {JobShowComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/jobOrder/jobOrder-show/job-show.component";
import {AutoCompleteTextViewComponent} from "./mobileTerminal/mobile-pages/common/autoCompleteTextView.component";


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
//  import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    AppComponent,
    AutoGeneratedComponent,
    LoginComponent,
    BarcodescannerComponent,
    HomeComponent,
    LocalnotificationComponent,
    WorkalertComponent,
    WorkalertDetailComponent,
    PmHomeComponent,
    EmHomeComponent,
    WmHomeComponent,
    WorkOrderOverviewComponent,
    WorkResComponent,
    JobShowQtyComponent,
    JobShowQciComponent,
    JobOrderComponent,
    JobShowComponent,
    AutoCompleteTextViewComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    NativeScriptFormsModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule,
    NativeScriptUICalendarModule,
    NativeScriptUIChartModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptUIGaugeModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    FontAwesomeModule,
  ],
  providers: [
    UserService,
    MsubLotService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
