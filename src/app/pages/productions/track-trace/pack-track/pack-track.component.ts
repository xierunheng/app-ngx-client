import { Component, OnInit } from '@angular/core';
import { MsubLot } from '../../../../@core/model/msublot';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewItem } from 'ngx-treeview';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';



@Component({
  selector: 'mes-pack-track',
  templateUrl: './pack-track.component.html',
  styleUrls: ['./pack-track.component.scss']
})
export class PackTrackComponent implements OnInit {
  //窗口信息的显示方式，包括‘窗体’和‘追溯’
  showtype = 'form';
   // this model is nothing but for [(ngModel)]
  // copied from server's MaterialSubLotSchema
  model: MsubLot;
  modelObserver: any;
  //单独的 materialSublot 呈现的 tree
  msltree: TreeviewItem[];
  ptSource: LocalDataSource = new LocalDataSource();
  zxSource: LocalDataSource = new LocalDataSource();
  ptbarcode:any;
  settings = {...TableSettings.basic};
  // ptSublot = [];
  // zxSublot = [];

  constructor(
      private service: MsubLotService) {
      this.initSetting();
  }

  initSetting(): void {
      this.settings.mode = TableSettings.exMode;
      this.settings.columns = {
        oid: {
          title: '名称',
          type: 'string',
        },
    }
  }

  ngOnInit() {
  }

  onSubmit(value: any): void {
    // let patch = jsonpatch.generate(this.modelObserver);
    // this.service.patchMsubLot(this.model._id, patch).subscribe(item => this.goBack());
      console.log(value);
      let oid = value.oid;
      console.log(oid);
      this.service.getMsubLotByOid(oid).subscribe(item => {
        console.log(item);
        if(item){
            this.msltree = this.service.newMsublotTree(item);
            this.model = new MsubLot(item);
            
            console.log(item.assSubLot);
            let zxSublot =[];
            let ptSublot =[];
            _.forEach(item.assSubLot, function(a) {
                if(a.oid.startsWith("98")){
                    zxSublot.push(a)
                }else{
                    ptSublot.push(a)
                }           
              
            });
            console.log(zxSublot);
            this.zxSource.load(zxSublot);
            console.log(this.zxSource);
            this.ptSource.load(ptSublot);
            console.log(this.model);
            this.modelObserver = jsonpatch.observe(this.model);
        }else{
          alert("该包材条码不存在")
        }
        
      });
  }

  showPtcode(val){
     console.log(val);
     this.service.getMsubLotByOid(val.oid).subscribe(item => {
       console.log(item);
       let data = [];
       if(item){
        _.forEach(item.assSubLot, function(a) {          
            data.push(a.oid)
        });
       }
       this.ptbarcode = data;
       
     })
  }  

}
