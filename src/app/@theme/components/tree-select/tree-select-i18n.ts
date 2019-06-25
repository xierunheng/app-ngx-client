import { TreeviewItem, TreeviewSelection, TreeviewI18nDefault } from 'ngx-treeview';

export class TreeSelectI18n extends TreeviewI18nDefault {
  private internalSelectedItem: TreeviewItem;

  set selectedItem(value: TreeviewItem) {
    if (value) {
      this.internalSelectedItem = value;
    }
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
    if (selection) {
      return this.internalSelectedItem ? this.internalSelectedItem.text : '请选择...';

    } else {
      return '等待数据...';
    }
  }

}
