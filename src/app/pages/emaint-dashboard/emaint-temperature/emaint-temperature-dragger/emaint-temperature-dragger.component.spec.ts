import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintTemperatureDraggerComponent } from './emaint-temperature-dragger.component';

describe('EmaintTemperatureDraggerComponent', () => {
  let component: EmaintTemperatureDraggerComponent;
  let fixture: ComponentFixture<EmaintTemperatureDraggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintTemperatureDraggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintTemperatureDraggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
