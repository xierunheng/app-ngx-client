import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlazeTrackComponent } from './glaze-track.component';

describe('GlazeTrackComponent', () => {
  let component: GlazeTrackComponent;
  let fixture: ComponentFixture<GlazeTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlazeTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlazeTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
