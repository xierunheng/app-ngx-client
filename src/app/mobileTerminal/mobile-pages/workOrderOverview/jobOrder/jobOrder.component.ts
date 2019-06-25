import {Component, OnInit} from "@angular/core";
import {WorkOrderOverviewService} from "../workOrderOverview.service";
import {RouterExtensions} from "nativescript-angular";
import {ActivatedRoute} from "@angular/router";
import {IJobOrder} from "../../../../@core/model/job-order";

@Component({
  selector: "mes-m-job",
  moduleId: module.id,
  templateUrl: "./jobOrder.component.html",
  styleUrls: ["./jobOrder.component.css"],
  providers: [WorkOrderOverviewService]
})
export class JobOrderComponent implements OnInit{

  jobOrders:IJobOrder[] = [];

  constructor(
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute,
    private workOrderOverviewService:WorkOrderOverviewService
  ){}

  ngOnInit(): void {
    this.workOrderOverviewService.getWorkRequest(this.route.snapshot.params.id)
      .subscribe(val=>{
        if(val&&val.jobOrder){
          this.jobOrders = val.jobOrder;
        }
      });
  }

  onChartTap(oid) {
    this.routerExtensions.navigate([`/workOrderOverview/jobOrder/job-show/${oid}`]);
  }

  backToWorkOrder(): void {
    this.routerExtensions.back();
  }

}
