import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorKbComponent } from './floor-kb.component';

describe('FloorKbComponent', () => {
  let component: FloorKbComponent;
  let fixture: ComponentFixture<FloorKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
