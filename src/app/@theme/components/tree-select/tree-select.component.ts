import { Component, Injectable, Input, Output, EventEmitter, forwardRef, ViewChild, OnChanges, SimpleChanges, HostBinding, OnInit, Optional, ɵlooseIdentical as looseIdentical } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, RequiredValidator } from '@angular/forms';
import * as _ from 'lodash';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { TreeSelectI18n } from './tree-select-i18n';


/**
 * [创建QtyRequired的验证工厂方法]
 * 该方法依赖于 RequiredValidator,在 RequiredValidator 不存在是，用Optional 代替，表示这是一个可选 Deps
 * @param {[type]} requiredValidator [description]
 */
export function createTreeRequiredValidator(requiredValidator) {
  return (c: FormControl) => {
    return requiredValidator && requiredValidator.required && !c.value ? { "requiredError": true } : null;
  }
}

@Component({
  selector: 'mes-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss'],
  providers: [
    {
      provide: TreeviewI18n,
      useClass: TreeSelectI18n
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (required) => {
        return createTreeRequiredValidator(required);
      },
      deps: [[new Optional(), RequiredValidator]],
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }
  ]
})
export class TreeSelectComponent implements OnChanges, OnInit, ControlValueAccessor {
  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  //只允许选择叶子结点
  @Input() nodeOnly: boolean;
  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  _value: any;
  @Input() 
  set value(value: any) {
    this._value = value;
  }

  @Output() valueChange = new EventEmitter<any>();

  @Input() required: boolean = true;
  // Allow the input to be disabled, and when it is make it somewhat transparent.
  @Input() disabled = false;
  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }

  @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  private treeSelectI18n: TreeSelectI18n;
  private _compareWith: (o1: any, o2: any) => boolean = looseIdentical;

  // Function to call when the qty changes.
  onChange = (_: any) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor(public i18n: TreeviewI18n) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasCollapseExpand: false,
      hasFilter: true,
      decoupleChildFromParent: true,
      maxHeight: 300
    });
    this.treeSelectI18n = i18n as TreeSelectI18n;
  }

  ngOnInit() {
    // this.updateValue(this.items, this.value);
  }

  // Allows Angular to update the model (qty).
  // Update the model and changes needed for the view here.
  writeValue(value: any): void {
    this._value = value;
    if(this.items) {
      this.updateSelectedItem();
    }
    // if (value !== null && this.items) {
    //   this._value = value;
    //   this.updateSelectedItem();
    // }
  }
  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(root: TreeviewItem[], sel: any) {
    if (root && root.length > 0 && sel) {
      root.forEach(item => {
        if (this._compareWith(item.value, sel)) {
          // if (sel._id && item.value && item.value._id && sel._id === item.value._id) {
          item.checked = true;
          return;
        } else if (item.children && item.children.length > 0) {
          this.updateValue(item.children, sel);
        }
        // item.correctChecked();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this._value && this.items) {
      this.updateSelectedItem();
    }
  }

  select(item: TreeviewItem) {
    if (this.nodeOnly) {
      if (item.children === undefined) {
        this.selectItem(item);
      }
    } else {
      this.selectItem(item);
    }
  }

  //在一个TreeviewItem中，遍历树，查找对应的值
  //可以用值的字面值，也可以用值的 _id 属性
  private findItem(root: TreeviewItem, value: any): TreeviewItem {
    if (_.isNil(root)) {
      return undefined;
    }
    // if (root.value === value || (root.value && root.value._id && value._id && root.value._id === value._id)) {
    if (this._compareWith(root.value, value)) {
      return root;
    }
    if (root.children) {
      for (const child of root.children) {
        const foundItem = this.findItem(child, value);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return undefined;
  }

  //在TreeviewItem的数组中查找对应的值
  private findItemInList(list: TreeviewItem[], value: any): TreeviewItem {
    if (_.isNil(list)) {
      return undefined;
    }
    for (const item of list) {
      const foundItem = this.findItem(item, value);
      if (foundItem) {
        return foundItem;
      }
    }
    return undefined;
  }

  private updateSelectedItem() {
    if (!_.isNil(this.items)) {
      const selectedItem = this.findItemInList(this.items, this._value);
      if (selectedItem) {
        this.selectItem(selectedItem);
      } else {
        this.selectAll();
      }
    }
  }

  private selectItem(item: TreeviewItem) {
    if (!this.disabled) {
      this.dropdownTreeviewComponent.dropdownDirective.close();
      if (this.treeSelectI18n.selectedItem !== item) {
        this.treeSelectI18n.selectedItem = item;
        //只有在选项和初始值不一致时，才触发事件
        if (!this._compareWith(this._value, item.value)) {
          this._value = item.value;
          this.valueChange.emit(item.value);
          this.onChange(this._value);
        }
      }
    }

  }

  private selectAll() {
    // const allItem = this.dropdownTreeviewComponent.treeviewComponent.allItem;
    // this.selectItem(allItem);
  }
}
