import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresidentKbComponent } from './president-kb.component';

describe('PresidentKbComponent', () => {
  let component: PresidentKbComponent;
  let fixture: ComponentFixture<PresidentKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresidentKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresidentKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
