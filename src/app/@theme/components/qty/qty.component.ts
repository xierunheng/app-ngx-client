import { Component, OnInit, EventEmitter, Input, Output, forwardRef, HostBinding, OnChanges, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, RequiredValidator } from '@angular/forms';
import { IQuantity } from '../../../@core/model/common';

/**
 * [验证数量的范围，不能超出指定的范围]
 * @param {[type]} maxValue [description]
 * @param {[type]} minValue [description]
 */
export function createQuantityRangeValidator(maxValue, minValue) {

  return (c: FormControl) => {
    let err = {
      rangeError: {
        given: c.value,
        max: maxValue || 10000,
        min: minValue || 0
      }
    };

    return c.value && (c.value.quantity > +maxValue || c.value.quantity < +minValue) ? { "rangeError": true } : null;
  }
}

/**
 * [这个验证方法过于简单，而且只能验证 ‘required’]
 * 暂时不用，放在这里作为示例
 * @param {FormControl} c [description]
 */
export function validQtyRequired(c: FormControl) {
  return c.value && (!c.value.quantity || !c.value.unit) ? { "requiredError": true } : null;
}

/**
 * [创建QtyRequired的验证工厂方法]
 * 该方法依赖于 RequiredValidator,在 RequiredValidator 不存在是，用Optional 代替，表示这是一个可选 Deps
 * @param {[type]} requiredValidator [description]
 */
export function createQtyRequiredValidator(requiredValidator) {
  return (c: FormControl) => {
    return requiredValidator && requiredValidator.required && c.value && (!c.value.quantity || !c.value.unit) ? { "requiredError": true } : null;
  }
}

@Component({
  selector: 'mes-qty',
  templateUrl: './qty.component.html',
  styleUrls: ['./qty.component.scss'],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QtyComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (required) => {
        return createQtyRequiredValidator(required);
      },
      deps: [[new Optional(), RequiredValidator]],
      multi: true
    },
    // {
    //   provide: NG_VALIDATORS,
    //   useValue: validQtyRequired,
    //   multi: true
    // },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QtyComponent),
      multi: true
    }
  ]
})
export class QtyComponent implements OnInit, ControlValueAccessor, OnChanges {
  _qty: IQuantity;
  @Input()
  set qty(qty: IQuantity) {    
    this._qty = qty;    
  };

  @Output() qtyChange = new EventEmitter<IQuantity>();

  @Input() required: boolean = true;
  // Allow the input to be disabled, and when it is make it somewhat transparent.
  @Input() disabled = false;
  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }

  //数量最大值
  // @Input() max: number = 10000;
  @Input() max: number;  
  //数量最小值
  // @Input() min: number = 0;
  @Input() min: number;

  // validateFn: any = createQuantityRangeValidator(this.max, this.min);
  validateFn: any = createQuantityRangeValidator(this.max, this.min);

  // Function to call when the qty changes.
  onChange = (qty: IQuantity) => { 
    // console.log('onchange',qty)
  };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(inputs) {
    
    if (inputs.max || inputs.min) {
      this.validateFn = createQuantityRangeValidator(this.max, this.min);
      this.onChange(this._qty);
    }
  }

  onQtyChange(event) {

    if (!this.disabled) {
      this.qtyChange.emit(this._qty);
      this.onChange(this._qty);
    }
  }

  // Allows Angular to update the model (qty).
  // Update the model and changes needed for the view here.
  writeValue(qty: IQuantity): void {
    if (qty) {
      this._qty = qty;
    }
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (qty: IQuantity) => void): void {
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

  validate(c: FormControl) {
    // console.log("c",c)
    return this.validateFn(c);
  }
}
