import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlazingKbComponent } from './glazing-kb.component';

describe('GlazingKbComponent', () => {
  let component: GlazingKbComponent;
  let fixture: ComponentFixture<GlazingKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlazingKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlazingKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
