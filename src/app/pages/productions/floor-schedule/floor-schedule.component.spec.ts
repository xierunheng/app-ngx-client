import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorScheduleComponent } from './floor-schedule.component';

describe('FloorScheduleComponent', () => {
  let component: FloorScheduleComponent;
  let fixture: ComponentFixture<FloorScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
