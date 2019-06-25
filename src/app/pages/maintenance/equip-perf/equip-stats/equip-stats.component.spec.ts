import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipStatsComponent } from './equip-stats.component';

describe('EStatsComponent', () => {
  let component: EquipStatsComponent;
  let fixture: ComponentFixture<EquipStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
