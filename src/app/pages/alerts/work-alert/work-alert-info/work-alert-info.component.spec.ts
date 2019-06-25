import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAlertInfoComponent } from './work-alert-info.component';

describe('WorkAlertInfoComponent', () => {
  let component: WorkAlertInfoComponent;
  let fixture: ComponentFixture<WorkAlertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAlertInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAlertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
