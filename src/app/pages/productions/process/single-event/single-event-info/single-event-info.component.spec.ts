import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEventInfoComponent } from './single-event-info.component';

describe('SingleEventInfoComponent', () => {
  let component: SingleEventInfoComponent;
  let fixture: ComponentFixture<SingleEventInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleEventInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
