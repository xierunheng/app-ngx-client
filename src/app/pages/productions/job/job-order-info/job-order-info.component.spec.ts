import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderInfoComponent } from './job-order-info.component';

describe('JobOrderInfoComponent', () => {
  let component: JobOrderInfoComponent;
  let fixture: ComponentFixture<JobOrderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOrderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
