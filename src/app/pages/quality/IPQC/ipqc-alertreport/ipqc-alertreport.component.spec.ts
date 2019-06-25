import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IPQCAlertreportComponent } from './ipqc-alertreport.component';

describe('IPQCAlertreportComponent', () => {
  let component: IPQCAlertreportComponent;
  let fixture: ComponentFixture<IPQCAlertreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IPQCAlertreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IPQCAlertreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
