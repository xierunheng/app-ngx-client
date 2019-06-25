import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {IWorkAlert} from "../../../@core/model/work-alert";
import {WorkAlertService} from "./workalert.service";

@Component({
  selector: "mes-m-workalert",
  moduleId: module.id,
  templateUrl: "./workalert.component.html",
  styleUrls: ["./workalert.component.css"],
  providers: [WorkAlertService]
})
export class WorkalertComponent implements OnInit{

  workalertList:IWorkAlert[] = [];

  constructor(
    private routerExtensions: RouterExtensions,
    private workAlertService: WorkAlertService
  ){}

  ngOnInit(): void {
    this.workAlertService.getWorkAlerts().subscribe(val=>{
      this.workalertList = val;
    });
  }

  onItemTap(args) {
    this.routerExtensions.navigate([`/workalert/workalert-detail/${this.workalertList[args.index]._id}`]);
  }

  backToHome(): void {
    this.routerExtensions.back();
  }
}
