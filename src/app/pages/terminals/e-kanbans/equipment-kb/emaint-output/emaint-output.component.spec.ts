import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintOutputComponent } from './emaint-output.component';

describe('EmaintOutputComponent', () => {
  let component: EmaintOutputComponent;
  let fixture: ComponentFixture<EmaintOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
