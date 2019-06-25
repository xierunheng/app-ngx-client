import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSmartTableComponent } from './modal-smart-table.component';

describe('ModalSmartTableComponent', () => {
  let component: ModalSmartTableComponent;
  let fixture: ComponentFixture<ModalSmartTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSmartTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
