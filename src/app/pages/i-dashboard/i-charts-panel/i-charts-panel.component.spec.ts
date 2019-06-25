import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IChartsPanelComponent } from './i-charts-panel.component';

describe('IChartsPanelComponent', () => {
  let component: IChartsPanelComponent;
  let fixture: ComponentFixture<IChartsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IChartsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IChartsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
