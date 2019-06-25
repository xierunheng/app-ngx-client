import {Component, NgZone, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WorkAlertService} from "../workalert.service";
import {IWorkAlert} from "../../../../@core/model/work-alert";
import {RouterExtensions} from "nativescript-angular";

@Component({
  selector: "mes-m-workalert-detail",
  moduleId: module.id,
  templateUrl: "./workalert-detail.component.html",
  styleUrls: ["./workalert-detail.component.css"],
  providers: [WorkAlertService]
})
export class WorkalertDetailComponent implements OnInit{

  _id:string = '';
  workAlert:IWorkAlert;

  constructor(
    private route : ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private workAlertService : WorkAlertService,
    private ngZone : NgZone
  ){}

  ngOnInit(): void {
    this.ngZone.run(()=>{
      this._id = this.route.snapshot.params._id;
      this.workAlertService.getWorkAlert(this._id).subscribe(value=>{
        if(value){
          this.workAlert = value;
        }else{
          this.workAlert = null;
        }
      });
    });
  }

  backToWorkalert(): void {
    this.routerExtensions.back();
  }

  confirm(even){}

  cancel(even){}

}
