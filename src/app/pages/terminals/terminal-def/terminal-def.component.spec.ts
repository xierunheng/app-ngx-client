import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDefComponent } from './terminal-def.component';

describe('TerminalDefComponent', () => {
  let component: TerminalDefComponent;
  let fixture: ComponentFixture<TerminalDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
