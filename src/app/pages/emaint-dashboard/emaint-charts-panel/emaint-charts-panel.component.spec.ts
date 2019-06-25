import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintChartsPanelComponent } from './emaint-charts-panel.component';

describe('EmaintChartsPanelComponent', () => {
  let component: EmaintChartsPanelComponent;
  let fixture: ComponentFixture<EmaintChartsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintChartsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintChartsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
