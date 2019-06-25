import {Component, OnInit} from "@angular/core";
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import {BarcodeScanner} from "nativescript-barcodescanner";
import {Item} from "./item";
import {registerElement} from "nativescript-angular/element-registry";
import {CardView} from "nativescript-cardview";
import {RouterExtensions} from "nativescript-angular";
import {MsubLotService} from "./msublot.service";
import {IMsubLot} from "../../../@core/model/msublot";
import {MaterialData} from "../../../@core/data/util.service";

registerElement("CardView", () => CardView);

@Component({
  selector: "mes-m-barcodescanner",
  moduleId: module.id,
  templateUrl: "./barcodescanner.component.html",
  styleUrls: ["./barcodescanner.component.css"],
  providers: [MsubLotService, MaterialData]
})
export class BarcodescannerComponent implements OnInit {

  barcodescanner: any;
  oplogData: any = [];
  oid: string = '';
  errorResult:string = '';

  constructor(
    private routerExtensions: RouterExtensions,
    private msubLotService: MsubLotService,
  ) {
    this.barcodescanner = new BarcodeScanner();
  }

  ngOnInit(): void {
  }

  getMsubLotByOid() {
    this.oplogData = [];
    this.msubLotService.getMsubLotByOid(this.oid).subscribe(iMsubLots => {
      if (iMsubLots || iMsubLots!=undefined) {
        iMsubLots.oplog.map(item => {
          let data = {
            name: MaterialData.BodyOps[item.op].name,
            date: new Date(item.date),
            hsname: item.hs ? item.hs.name : '',
            psubperson: item.psub.person ? (item.psub.person.name + "-[" + item.psub.person.oid + "]") : ''
          }
          this.oplogData.push(data);
          this.errorResult = '';
        })
      }else{
        this.errorResult = '没有该产品信息！！';
        this.oplogData = [];
      }
    });
  }

  onChange(){
    this.errorResult = '';
  }

  openBarcodesScanner(): void {
    this.barcodescanner.scan({
      formats: "QR_CODE, EAN_13",
      cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
      cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)

      showFlipCameraButton: true,   // default false
      preferFrontCamera: false,     // default false
      showTorchButton: true,        // default false
      beepOnScan: true,             // Play or Suppress beep on scan (default true)
      torchOn: false,               // launch with the flashlight on (default false)
      closeCallback: () => {
        console.log("Scanner closed");
      }, // invoked when the scanner was closed (success or abort)

      openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }).then((result) => {
        this.oid = result.text;
        // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
        console.log(
          {
            title: "扫描结果",
            message: "Format: " + result.format + ",\nValue: " + result.text,
            okButtonText: "OK"
          }, this.oid, 222
        );
        this.getMsubLotByOid();

      }, (errorMessage) => {
        console.log("No scan. " + errorMessage);
      }
    );
  }

  backToHome(): void {
    this.routerExtensions.back();
  }

  listPickerCountries: Array<string> = ["Australia", "Belgium", "Bulgaria", "Canada", "Switzerland",
    "China", "Czech Republic", "Germany", "Spain", "Ethiopia", "Croatia", "Hungary",
    "Italy", "Jamaica", "Romania", "Russia", "United States"];
  countries: { name: string, imageSrc: string }[] = [
    {name: "Australia", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/au.png"},
    {name: "Belgium", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/be.png"},
    {name: "Bulgaria", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/bg.png"},
    {name: "Canada", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/ca.png"},
    {name: "Switzerland", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/ch.png"},
    {name: "China", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/cn.png"},
    {name: "Czech Republic", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/cz.png"},
    {name: "Germany", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/de.png"},
    {name: "Spain", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/es.png"},
    {name: "Ethiopia", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/et.png"},
    {name: "Croatia", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/hr.png"},
    {name: "Hungary", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/hu.png"},
    {name: "Italy", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/it.png"},
    {name: "Jamaica", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/jm.png"},
    {name: "Romania", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/ro.png"},
    {name: "Russia", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/ru.png"},
    {name: "United States", imageSrc: "https://play.nativescript.org/dist/assets/img/flags/us.png"},
  ];
}
