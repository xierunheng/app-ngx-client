import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonStatsComponent } from './person-stats.component';

describe('PersonStatsComponent', () => {
  let component: PersonStatsComponent;
  let fixture: ComponentFixture<PersonStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
