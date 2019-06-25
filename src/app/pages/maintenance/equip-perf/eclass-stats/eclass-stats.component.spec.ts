import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclassStatsComponent } from './eclass-stats.component';

describe('EclassStatsComponent', () => {
  let component: EclassStatsComponent;
  let fixture: ComponentFixture<EclassStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclassStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclassStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
