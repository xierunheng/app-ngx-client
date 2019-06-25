import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MolderBodyStatsComponent } from './molder-body-stats.component';

describe('MolderBodyStatsComponent', () => {
  let component: MolderBodyStatsComponent;
  let fixture: ComponentFixture<MolderBodyStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MolderBodyStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MolderBodyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
