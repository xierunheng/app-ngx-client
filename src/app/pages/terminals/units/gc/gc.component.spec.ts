import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GCComponent } from './gc.component';

describe('GCComponent', () => {
  let component: GCComponent;
  let fixture: ComponentFixture<GCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
