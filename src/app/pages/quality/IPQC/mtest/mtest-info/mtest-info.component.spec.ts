import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtestInfoComponent } from './mtest-info.component';

describe('MtestInfoComponent', () => {
  let component: MtestInfoComponent;
  let fixture: ComponentFixture<MtestInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtestInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
