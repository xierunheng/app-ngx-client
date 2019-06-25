import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiInfoComponent } from './kpi-info.component';

describe('KpiInfoComponent', () => {
  let component: KpiInfoComponent;
  let fixture: ComponentFixture<KpiInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
