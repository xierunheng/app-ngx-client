import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackTrackComponent } from './pack-track.component';

describe('PackTrackComponent', () => {
  let component: PackTrackComponent;
  let fixture: ComponentFixture<PackTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
