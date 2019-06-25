import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCompareComponent } from './process-compare.component';

describe('ProcessCompareComponent', () => {
  let component: ProcessCompareComponent;
  let fixture: ComponentFixture<ProcessCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
