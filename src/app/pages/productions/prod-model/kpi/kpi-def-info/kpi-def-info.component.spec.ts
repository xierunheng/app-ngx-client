import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDefInfoComponent } from './kpi-def-info.component';

describe('KpiDefInfoComponent', () => {
  let component: KpiDefInfoComponent;
  let fixture: ComponentFixture<KpiDefInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiDefInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
