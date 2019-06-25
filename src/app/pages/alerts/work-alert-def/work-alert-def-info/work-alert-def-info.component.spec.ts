import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAlertDefInfoComponent } from './work-alert-def-info.component';

describe('WorkAlertDefInfoComponent', () => {
  let component: WorkAlertDefInfoComponent;
  let fixture: ComponentFixture<WorkAlertDefInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAlertDefInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAlertDefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
