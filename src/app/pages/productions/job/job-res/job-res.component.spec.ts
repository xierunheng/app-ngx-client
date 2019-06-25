import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobResComponent } from './job-res.component';

describe('JobResComponent', () => {
  let component: JobResComponent;
  let fixture: ComponentFixture<JobResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobResComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
