import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmgtKbComponent } from './equipmgt-kb.component';

describe('EquipmgtKbComponent', () => {
  let component: EquipmgtKbComponent;
  let fixture: ComponentFixture<EquipmgtKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmgtKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmgtKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
