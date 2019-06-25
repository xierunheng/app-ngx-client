import { Component, OnInit } from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
  selector: "mes-m-home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data = [];

  constructor(
    private routerExtensions: RouterExtensions,
  ) {}

  ngOnInit(): void {
    this.data.push({ text: "产品扫码", path: "barcodescanner" });
    this.data.push({ text: "告警推送", path: "localnotification" });
    this.data.push({ text: "告警列表", path: "workalert" });
    this.data.push({ text: "Charmander", path: "" });
    this.data.push({ text: "Charmeleon", path: "" });
    this.data.push({ text: "Charizard", path: "" });
    this.data.push({ text: "Squirtle", path: "" });
    this.data.push({ text: "Wartortle", path: "" });
    this.data.push({ text: "Blastoise", path: "" });
    this.data.push({ text: "Caterpie", path: "" });
    this.data.push({ text: "Metapod", path: "" });
    this.data.push({ text: "Butterfree", path: "" });
    this.data.push({ text: "Weedle", path: "" });
    this.data.push({ text: "Kakuna", path: "" });
    this.data.push({ text: "Beedrill", path: "" });
  }

  onProductionManagementTap(args) {
    console.log(args.element);
    this.routerExtensions.navigate(["pmHome"]);
  }

  onEquipmentManagementTap(args){
    this.routerExtensions.navigate(["emHome"]);
  }

  onWarningManagementTap(args){
    this.routerExtensions.navigate(["wmHome"]);
  }

  onWorkOrderOverviewTap(args){
    this.routerExtensions.navigate(["workOrderOverview"]);
  }
}
