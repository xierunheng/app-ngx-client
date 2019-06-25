import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDefInfoComponent } from './terminal-def-info.component';

describe('TerminalDefInfoComponent', () => {
  let component: TerminalDefInfoComponent;
  let fixture: ComponentFixture<TerminalDefInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalDefInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalDefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
