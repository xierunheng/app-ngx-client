import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcemodalComponent } from './forcemodal.component';

describe('ForcemodalComponent', () => {
  let component: ForcemodalComponent;
  let fixture: ComponentFixture<ForcemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
