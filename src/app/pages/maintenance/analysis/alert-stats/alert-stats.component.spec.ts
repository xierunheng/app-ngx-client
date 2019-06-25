import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertStatsComponent } from './alert-stats.component';

describe('AlertStatsComponent', () => {
  let component: AlertStatsComponent;
  let fixture: ComponentFixture<AlertStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
