import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipListComponent } from './equip-list.component';

describe('EquipListComponent', () => {
  let component: EquipListComponent;
  let fixture: ComponentFixture<EquipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
