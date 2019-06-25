import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalAlertComponent } from './terminal-alert.component';

describe('TerminalAlertComponent', () => {
  let component: TerminalAlertComponent;
  let fixture: ComponentFixture<TerminalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
