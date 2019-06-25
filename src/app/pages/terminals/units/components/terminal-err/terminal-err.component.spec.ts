import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalErrComponent } from './terminal-err.component';

describe('TerminalErrComponent', () => {
  let component: TerminalErrComponent;
  let fixture: ComponentFixture<TerminalErrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalErrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalErrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
