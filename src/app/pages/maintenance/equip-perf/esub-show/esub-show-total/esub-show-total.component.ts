import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';

import { NbThemeService } from '@nebular/theme';
import { IQuantity, Quantity } from '../../../../../@core/model/common';

@Component({
  selector: 'mes-esub-show-total',
  template: `
    <nb-card size="xsmall" class="solar-card">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-body>
        <div echarts [options]="option" theme="macarons" class="echart">
        </div>
        <div class="info">
          <div class="value">{{_value.quantity}}/{{_total.quantity}}{{_value.unit}}</div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./esub-show-total.component.scss']
})
export class EsubShowTotalComponent implements AfterViewInit, OnDestroy  {
  /**
   * 标题
   * @type {String}
   */
  @Input() title: string;
  /**
   * 有效值, 分子
   * @type {Number}
   */
  _value: IQuantity = new Quantity;
  /**
   * 总值, 分母
   * @type {Number}
   */
  _total: IQuantity = new Quantity;

  @Input('value')
  set value(qty: IQuantity) {
    if (qty) {
      this._value = qty;
      if (this.option.series) {
        this.option.series[0].data[0].value = this._value.quantity;
        this.option.series[0].data[1].value = this._total.quantity - this._value.quantity;
        this.option.series[1].data[0].value = this._value.quantity;
        this.option.series[1].data[1].value = this._total.quantity - this._value.quantity;
      }
    }
  }

  @Input('total')
  set total(qty: IQuantity) {
    if (qty) {
      this._total = qty;
      if (this.option.series) {
        this.option.series[0].data[1].value = this._total.quantity - this._value.quantity;
        this.option.series[1].data[1].value = this._total.quantity - this._value.quantity;
      }
    }
  }

  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {

      const solarTheme: any = config.variables.solar;

      this.option = Object.assign({}, {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this._value.quantity,
                name: ' ',
                label: {
                  normal: {
                    position: 'center',
                    formatter: '{d}%',
                    textStyle: {
                      fontSize: '22',
                      fontFamily: config.variables.fontSecondary,
                      fontWeight: '600',
                      color: config.variables.fgHeading,
                    },
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: this._total.quantity - this._value.quantity,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'inner',
                  },
                },
                itemStyle: {
                  normal: {
                    color: config.variables.layoutBg,
                  },
                },
              },
            ],
          },
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this._value.quantity,
                name: ' ',
                label: {
                  normal: {
                    position: 'inner',
                    show: false,
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 7,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: this._total.quantity - this._value.quantity,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'top',
                  },
                },
                itemStyle: {
                  normal: {
                    color: 'none',
                  },
                },
              },
            ],
          },
        ],
      });
    });
  }

  ngOnDestroy() {
    if(this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

}
