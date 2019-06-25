import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipPerfComponent } from './equip-perf.component';

describe('EquipPerfComponent', () => {
  let component: EquipPerfComponent;
  let fixture: ComponentFixture<EquipPerfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipPerfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipPerfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
