import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmtSignalComponent } from './emt-signal.component';

describe('EmtSignalComponent', () => {
  let component: EmtSignalComponent;
  let fixture: ComponentFixture<EmtSignalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmtSignalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmtSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
