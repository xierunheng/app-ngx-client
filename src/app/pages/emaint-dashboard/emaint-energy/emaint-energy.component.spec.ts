import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintEnergyComponent } from './emaint-energy.component';

describe('EmaintEnergyComponent', () => {
  let component: EmaintEnergyComponent;
  let fixture: ComponentFixture<EmaintEnergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
