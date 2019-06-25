import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintProsegComponent } from './emaint-proseg.component';

describe('EmaintProsegComponent', () => {
  let component: EmaintProsegComponent;
  let fixture: ComponentFixture<EmaintProsegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintProsegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintProsegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
