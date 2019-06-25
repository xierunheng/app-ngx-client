import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintLocComponent } from './emaint-loc.component';

describe('EmaintLocComponent', () => {
  let component: EmaintLocComponent;
  let fixture: ComponentFixture<EmaintLocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintLocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
