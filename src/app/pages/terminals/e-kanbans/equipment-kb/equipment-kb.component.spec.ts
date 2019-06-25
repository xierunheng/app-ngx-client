import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentKbComponent } from './equipment-kb.component';

describe('EquipmentKbComponent', () => {
  let component: EquipmentKbComponent;
  let fixture: ComponentFixture<EquipmentKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
