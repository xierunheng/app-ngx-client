import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAlertInfoComponent } from './e-alert-info.component';

describe('EAlertInfoComponent', () => {
  let component: EAlertInfoComponent;
  let fixture: ComponentFixture<EAlertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAlertInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAlertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
