import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipInfoComponent } from './equip-info.component';

describe('EquipInfoComponent', () => {
  let component: EquipInfoComponent;
  let fixture: ComponentFixture<EquipInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
