import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpReqInfoComponent } from './op-req-info.component';

describe('OpReqInfoComponent', () => {
  let component: OpReqInfoComponent;
  let fixture: ComponentFixture<OpReqInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpReqInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpReqInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
