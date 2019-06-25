import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtestSpecComponent } from './mtest-spec.component';

describe('MtestSpecComponent', () => {
  let component: MtestSpecComponent;
  let fixture: ComponentFixture<MtestSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtestSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtestSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
