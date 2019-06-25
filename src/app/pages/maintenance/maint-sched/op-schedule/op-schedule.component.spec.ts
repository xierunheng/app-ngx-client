import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpScheduleComponent } from './op-schedule.component';

describe('OpScheduleComponent', () => {
  let component: OpScheduleComponent;
  let fixture: ComponentFixture<OpScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
