import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpReqComponent } from './op-req.component';

describe('OpReqComponent', () => {
  let component: OpReqComponent;
  let fixture: ComponentFixture<OpReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
