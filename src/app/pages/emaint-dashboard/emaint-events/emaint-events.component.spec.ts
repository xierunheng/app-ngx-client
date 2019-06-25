import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintEventsComponent } from './emaint-events.component';

describe('EmaintEventsComponent', () => {
  let component: EmaintEventsComponent;
  let fixture: ComponentFixture<EmaintEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
