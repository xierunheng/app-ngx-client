import { Component, EventEmitter, Input, Output, OnInit, forwardRef, SimpleChanges, Optional, HostBinding, ɵlooseIdentical as looseIdentical } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, RequiredValidator } from '@angular/forms';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, TreeviewComponent, DropdownTreeviewComponent } from 'ngx-treeview';
import { MultiSelectI18n } from './multi-select-i18n';
import * as _ from 'lodash';

/**
 * [创建QtyRequired的验证工厂方法]
 * 该方法依赖于 RequiredValidator,在 RequiredValidator 不存在是，用Optional 代替，表示这是一个可选 Deps
 * @param {[type]} requiredValidator [description]
 */
export function createMultiTreeRequiredValidator(requiredValidator) {
  return (c: FormControl) => {
    return requiredValidator && requiredValidator.required && !c.value ? { "requiredError": true } : null;
  }
}

@Component({
  selector: 'mes-tree-multi-select',
  templateUrl: './tree-multi-select.component.html',
  styleUrls: ['./tree-multi-select.component.scss'],
  providers: [
    {
      provide: TreeviewI18n,
      useClass: MultiSelectI18n
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (required) => {
        return createMultiTreeRequiredValidator(required);
      },
      deps: [[new Optional(), RequiredValidator]],
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeMultiSelectComponent),
      multi: true
    }
  ]
})
export class TreeMultiSelectComponent implements OnInit, ControlValueAccessor {
  @Input() config: TreeviewConfig;
  //备选项
  _items: TreeviewItem[];
  @Input() 
  set items(items: TreeviewItem[]) {
    this._items = items;
    if (this._value && this._items) {
      let sels = _.cloneDeep(this._value);
      this.updateValue(this._items, sels);
    }
  }

  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }

  _value: any[];
  // @Input()
  // set value(value: any[]) {
  //   this._value = value;
  // }

  // @Output() valueChange = new EventEmitter<any[]>();

  @Input() required: boolean = true;
  // Allow the input to be disabled, and when it is make it somewhat transparent.
  @Input() disabled = false;
  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }
  // Function to call when the qty changes.
  onChange = (_: any) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  private _compareWith: (o1: any, o2: any) => boolean = looseIdentical;
  constructor(public i18n: TreeviewI18n) {

  }

  ngOnInit() {
    if (!this.config) {
      this.config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasCollapseExpand: false,
        hasFilter: true,
        decoupleChildFromParent: false,
        maxHeight: 300
      });
    }
  }

  // Allows Angular to update the model (qty).
  // Update the model and changes needed for the view here.
  writeValue(value: any[]): void {
    if (value !== null && value !== undefined) {
      this._value = value;
      if (this._items) {
        let sels = _.cloneDeep(value);
        this.updateValue(this._items, sels);
      }
    }
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

  updateValue(root: TreeviewItem[], sels: any[]) {
    if (sels && sels.length > 0 && root && root.length > 0) {
      root.forEach(item => {
        let index = sels.findIndex(sel => this._compareWith(sel, item.value));
        if (index > -1) {
          item.checked = true;
          sels.splice(index, 1);
        }
        if (sels && sels.length > 0 && item.children && item.children.length > 0) {
          this.updateValue(item.children, sels);
        }
      });
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (this._value && this._items) {
  //     let sels = _.cloneDeep(this._value);
  //     this.updateValue(this._items, sels);
  //   }
  // }

  /**
   * [这里千万要小心，只有_id, oid, name, 才有意义，能够选择]
   * @param {[type]} items [description]
   */
  onSelectedChange(items) {
    let change = _.xorBy(items, this._value, '_id');
    if (!change || change.length <= 0) {
      change = _.xorBy(items, this._value, 'oid');
      if (!change || change.length <= 0) {
        change = _.xorBy(items, this._value, 'name');
        if (!change || change.length <= 0) {
          change = _.xorBy(items, this._value);
        }
      }
    }
    //只有在选项与初始值不一致的时候，才触发事件
    if (change && change.length > 0) {
      this._value = items;
      // this.valueChange.emit(items);
      this.onChange(items);
    }
  }
}
