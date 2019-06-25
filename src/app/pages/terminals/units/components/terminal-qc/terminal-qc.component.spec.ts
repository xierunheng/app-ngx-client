import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalQcComponent } from './terminal-qc.component';

describe('TerminalQcComponent', () => {
  let component: TerminalQcComponent;
  let fixture: ComponentFixture<TerminalQcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalQcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
