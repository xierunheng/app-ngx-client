import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OplogComponent } from './oplog.component';

describe('OplogComponent', () => {
  let component: OplogComponent;
  let fixture: ComponentFixture<OplogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OplogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OplogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
