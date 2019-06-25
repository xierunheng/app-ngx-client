import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAlertComponent } from './work-alert.component';

describe('WorkAlertComponent', () => {
  let component: WorkAlertComponent;
  let fixture: ComponentFixture<WorkAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
