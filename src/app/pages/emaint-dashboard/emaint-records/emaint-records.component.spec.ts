import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintRecordsComponent } from './emaint-records.component';

describe('EmaintRecordsComponent', () => {
  let component: EmaintRecordsComponent;
  let fixture: ComponentFixture<EmaintRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
