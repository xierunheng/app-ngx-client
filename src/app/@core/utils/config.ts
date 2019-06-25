import { TreeviewConfig } from 'ngx-treeview';
import { Injectable } from '@angular/core';

/**
 * [ngx-treeview's config, used for ngx-select-tree and others]
 * @type {Object}
 */
export const treeConfig = {
  //多选，父节点可选
  multi: TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 300
  })
};

@Injectable()
export class ViewConfig {
  //本页面的Title
  public title: string = '创建/修改';
  //本页面的按钮名称
  public buttonText: string = '新建/更新';
  //该页面的类型，包括‘create’，‘update’，‘get’
  public type: string = 'get';

  get hasDivider(): boolean {
    return this.type === 'get';
  }

  public static create(fields?: {
    title?: string,
    buttonText?: string,
    type?: string,
  }): ViewConfig {
    const config = new ViewConfig();
    Object.assign(config, fields);
    return config;
  }
}
