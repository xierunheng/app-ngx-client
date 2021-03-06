import { Component, OnInit } from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
  selector: "mes-m-wmHome",
  moduleId: module.id,
  templateUrl: "./wmHome.component.html",
  styleUrls: ['./wmHome.component.css']
})
export class WmHomeComponent implements OnInit {

  data = [];

  constructor(
    private routerExtensions: RouterExtensions,
  ) {}

  ngOnInit(): void {
    this.data.push({ text: "告警推送", path: "localnotification" });
    this.data.push({ text: "告警列表", path: "workalert" });
  }

  backToHome(): void {
    this.routerExtensions.back();
  }

  onItemTap(args) {
    console.log(this.data[args.index].text+"::"+this.data[args.index].path);
    this.routerExtensions.navigate([this.data[args.index].path]);
  }
}
