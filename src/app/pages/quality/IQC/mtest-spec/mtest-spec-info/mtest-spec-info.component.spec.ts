import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtestSpecInfoComponent } from './mtest-spec-info.component';

describe('MtestSpecInfoComponent', () => {
  let component: MtestSpecInfoComponent;
  let fixture: ComponentFixture<MtestSpecInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtestSpecInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtestSpecInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
