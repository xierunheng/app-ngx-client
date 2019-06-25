import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ILossAnalyticsComponent } from './i-loss-analytics.component';

describe('ILossAnalyticsComponent', () => {
  let component: ILossAnalyticsComponent;
  let fixture: ComponentFixture<ILossAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ILossAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ILossAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
