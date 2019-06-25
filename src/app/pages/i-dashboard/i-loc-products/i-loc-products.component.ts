import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { CountryOrderData } from '../../../@core/data/country-order';
import { MsubLotService } from '../../../@core/data/msublot.service';
import { IHierarchyScope } from '../../../@core/model/hs';
import { GlobalData } from '../../../@core/model/global';

@Component({
  selector: 'mes-i-loc-products',
  templateUrl: './i-loc-products.component.html',
  styleUrls: ['./i-loc-products.component.scss']
})
export class ILocProductsComponent implements OnInit, OnDestroy {

  @HostBinding('class.expanded')
  private expanded: boolean;
  private selected: number;

  private alive = true;

  hss: IHierarchyScope[];

  /**
   * [选择的区域]
   * @type {IHierarchyScope}
   */
  loc: IHierarchyScope;

  prodData: any[] = [];

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private countryOrderService: CountryOrderData,
              private mslService: MsubLotService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
    GlobalData.hss$.subscribe(hss => {
      this.hss = hss;
      this.selectByLoc('生产部');
    })
  }

  selectByLoc(locName: string) {
    this.loc = this.hss.find(item => item.name === locName);

    this.mslService.aggrQty('mdef.oid', this.loc, undefined, undefined, {
      opState: { $ne: 'Created' },
    }).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.prodData = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
