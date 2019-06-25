import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PclassStatsComponent } from './pclass-stats.component';

describe('PclassStatsComponent', () => {
  let component: PclassStatsComponent;
  let fixture: ComponentFixture<PclassStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PclassStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PclassStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
