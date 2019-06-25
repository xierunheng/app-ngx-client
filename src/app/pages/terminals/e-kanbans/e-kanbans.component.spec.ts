import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EKanbansComponent } from './e-kanbans.component';

describe('EKanbansComponent', () => {
  let component: EKanbansComponent;
  let fixture: ComponentFixture<EKanbansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EKanbansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EKanbansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
