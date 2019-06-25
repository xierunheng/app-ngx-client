import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpScheduleInfoComponent } from './op-schedule-info.component';

describe('OpScheduleInfoComponent', () => {
  let component: OpScheduleInfoComponent;
  let fixture: ComponentFixture<OpScheduleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpScheduleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpScheduleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
