import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintTotalComponent } from './emaint-total.component';

describe('EmaintTotalComponent', () => {
  let component: EmaintTotalComponent;
  let fixture: ComponentFixture<EmaintTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
