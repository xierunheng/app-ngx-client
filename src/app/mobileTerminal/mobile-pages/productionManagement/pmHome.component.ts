import { Component, OnInit } from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
  selector: "mes-m-pmHome",
  moduleId: module.id,
  templateUrl: "./pmHome.component.html",
  styleUrls: ['./pmHome.component.css']
})
export class PmHomeComponent implements OnInit {

  data = [];

  constructor(
    private routerExtensions: RouterExtensions,
  ) {}

  ngOnInit(): void {
    this.data.push({ text: "产品扫码", path: "barcodescanner" });
  }

  backToHome(): void {
    this.routerExtensions.back();
  }

  onItemTap(args) {
    console.log(this.data[args.index].text+"::"+this.data[args.index].path);
    this.routerExtensions.navigate([this.data[args.index].path]);
  }
}
