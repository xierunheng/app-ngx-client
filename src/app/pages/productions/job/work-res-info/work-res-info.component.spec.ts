import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkResInfoComponent } from './work-res-info.component';

describe('WorkResInfoComponent', () => {
  let component: WorkResInfoComponent;
  let fixture: ComponentFixture<WorkResInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkResInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkResInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
