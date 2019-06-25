import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAlertDefComponent } from './work-alert-def.component';

describe('WorkAlertDefComponent', () => {
  let component: WorkAlertDefComponent;
  let fixture: ComponentFixture<WorkAlertDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAlertDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAlertDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
