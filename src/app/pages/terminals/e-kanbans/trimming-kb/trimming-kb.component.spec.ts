import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimmingKBComponent } from './trimming-kb.component';

describe('TrimmingKBComponent', () => {
  let component: TrimmingKBComponent;
  let fixture: ComponentFixture<TrimmingKBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrimmingKBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrimmingKBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
