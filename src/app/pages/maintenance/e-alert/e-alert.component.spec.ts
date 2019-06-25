import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAlertComponent } from './e-alert.component';

describe('EAlertComponent', () => {
  let component: EAlertComponent;
  let fixture: ComponentFixture<EAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
