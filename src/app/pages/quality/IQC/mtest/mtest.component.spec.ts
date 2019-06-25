import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtestComponent } from './mtest.component';

describe('MtestComponent', () => {
  let component: MtestComponent;
  let fixture: ComponentFixture<MtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
