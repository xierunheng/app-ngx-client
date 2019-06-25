import { Injectable } from '@angular/core';
import { TreeviewItem, TreeviewSelection, TreeviewI18nDefault } from 'ngx-treeview';

@Injectable()
export class MultiSelectI18n extends TreeviewI18nDefault {

  getText(selection: TreeviewSelection): string {
    //这里要做一个初始的判断，否则浏览器在没有加载数据的时候，
    //会不停的报错
    if (selection) {
      // if (selection.uncheckedItems.length === 0) {
      //   return this.getAllCheckboxText();
      // }

      switch (selection.checkedItems.length) {
        case 0:
          return '请选择...';
        default:
          return selection.checkedItems.map(item => item.text).join(',');
      }
    } else {
      return '等待数据...';
    }

  }

}
