import {NgModule} from '@angular/core';
import {NativeScriptRouterModule} from 'nativescript-angular/router';
import {Routes} from '@angular/router';
import {UserService} from "./mobileTerminal/mobile-pages/login/user.service";
import {LoginComponent} from "./mobileTerminal/mobile-pages/login/login.component";
import {BarcodescannerComponent} from "./mobileTerminal/mobile-pages/barcodescanner/barcodescanner.component";
import {HomeComponent} from "./mobileTerminal/mobile-pages/home/home.component";
import {LocalnotificationComponent} from "./mobileTerminal/mobile-pages/localnotification/localnotification.component";
import {WorkalertComponent} from "./mobileTerminal/mobile-pages/workalert/workalert.component";
import {WorkalertDetailComponent} from "./mobileTerminal/mobile-pages/workalert/workalert-detail/workalert-detail.component";
import {PmHomeComponent} from "./mobileTerminal/mobile-pages/productionManagement/pmHome.component";
import {EmHomeComponent} from "./mobileTerminal/mobile-pages/equipmentManagement/emHome.component";
import {WmHomeComponent} from "./mobileTerminal/mobile-pages/warningManagement/wmHome.component";
import {WorkOrderOverviewComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview.component";
import {WorkResComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/workOrderOverview-detail/work-res.component";
import {JobOrderComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/jobOrder/jobOrder.component";
import {JobShowComponent} from "./mobileTerminal/mobile-pages/workOrderOverview/jobOrder/jobOrder-show/job-show.component";

export const routes: Routes = [

  {
    path: '',
    redirectTo: UserService.isUserLoggedIn()?'/home':'/login',
    pathMatch: 'full',
  },
  { path: "login", component:LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "pmHome", component: PmHomeComponent },
  { path: "emHome", component: EmHomeComponent },
  { path: "wmHome", component: WmHomeComponent },
  { path: "workOrderOverview", component: WorkOrderOverviewComponent },
  { path: "workOrderOverview/work-res/:oid", component: WorkResComponent },
  { path: "workOrderOverview/jobOrder/:id", component: JobOrderComponent },
  { path: "workOrderOverview/jobOrder/job-show/:oid", component: JobShowComponent },
  { path: "barcodescanner",component:BarcodescannerComponent},
  { path: "localnotification",component:LocalnotificationComponent},
  { path: "workalert",component:WorkalertComponent},
  { path: "workalert/workalert-detail/:_id",component:WorkalertDetailComponent,data:{_id:'123',name:'小六'}},
  { path: '**', component: LoginComponent }

];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
