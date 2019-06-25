import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintWeatherComponent } from './emaint-weather.component';

describe('EmaintWeatherComponent', () => {
  let component: EmaintWeatherComponent;
  let fixture: ComponentFixture<EmaintWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
