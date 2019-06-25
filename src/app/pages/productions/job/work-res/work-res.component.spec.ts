import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkResComponent } from './work-res.component';

describe('WorkResComponent', () => {
  let component: WorkResComponent;
  let fixture: ComponentFixture<WorkResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkResComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
