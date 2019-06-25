import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IPQCStatisticsComponent } from './ipqc-statistics.component';

describe('IPQCStatisticsComponent', () => {
  let component: IPQCStatisticsComponent;
  let fixture: ComponentFixture<IPQCStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IPQCStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IPQCStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
