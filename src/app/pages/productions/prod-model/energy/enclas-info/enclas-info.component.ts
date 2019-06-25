import { Component, OnInit,Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { TreeviewItem } from 'ngx-treeview';
import { IEnclass, IEnclassProfile,Enclass } from '../../../../../@core/model/enclass';
import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';
import { GlobalData } from '../../../../../@core/model/global';
import { EnclassService } from '../../../../../@core/data/enclass.service';


@Component({
  selector: 'ngx-enclas-info',
  templateUrl: './enclas-info.component.html',
  styleUrls: ['./enclas-info.component.scss']
})
export class EnclasInfoComponent implements OnInit {

  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's HierarchyScopeSchema
  // model: IHierarchyScope = new HierarchyScope();
  @Input() model: IEnclass = new Enclass();

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;


  // leveltree: TreeviewItem[] = [new TreeviewItem(UtilData.hsLevelTree)];
  get hstree() {
    return GlobalData.hstree;
  }

  constructor(
      private service: EnclassService,
      protected ref: NbDialogRef<EnclasInfoComponent>) {     
      
  }

  ngOnInit() {
      console.log(this.model);
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
