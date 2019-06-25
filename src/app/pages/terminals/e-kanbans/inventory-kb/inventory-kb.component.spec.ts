import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryKbComponent } from './inventory-kb.component';

describe('InventoryKbComponent', () => {
  let component: InventoryKbComponent;
  let fixture: ComponentFixture<InventoryKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
