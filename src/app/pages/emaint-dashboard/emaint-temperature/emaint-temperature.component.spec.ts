import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintTemperatureComponent } from './emaint-temperature.component';

describe('EmaintTemperatureComponent', () => {
  let component: EmaintTemperatureComponent;
  let fixture: ComponentFixture<EmaintTemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintTemperatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
