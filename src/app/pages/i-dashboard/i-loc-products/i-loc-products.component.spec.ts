import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ILocProductsComponent } from './i-loc-products.component';

describe('ILocProductsComponent', () => {
  let component: ILocProductsComponent;
  let fixture: ComponentFixture<ILocProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ILocProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ILocProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
