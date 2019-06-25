import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalWarningComponent } from './terminal-warning.component';

describe('TerminalWarningComponent', () => {
  let component: TerminalWarningComponent;
  let fixture: ComponentFixture<TerminalWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
