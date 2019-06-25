import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessEquipmentComponent } from './process-equipment.component';

describe('ProcessEquipmentComponent', () => {
  let component: ProcessEquipmentComponent;
  let fixture: ComponentFixture<ProcessEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
