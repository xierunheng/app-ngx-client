import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkReqInfoComponent } from './work-req-info.component';

describe('WorkReqInfoComponent', () => {
  let component: WorkReqInfoComponent;
  let fixture: ComponentFixture<WorkReqInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkReqInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkReqInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
