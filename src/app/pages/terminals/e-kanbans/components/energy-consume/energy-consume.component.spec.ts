import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyConsumeComponent } from './energy-consume.component';

describe('EnergyConsumeComponent', () => {
  let component: EnergyConsumeComponent;
  let fixture: ComponentFixture<EnergyConsumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyConsumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyConsumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
