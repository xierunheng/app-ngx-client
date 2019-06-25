import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalJobComponent } from './terminal-job.component';

describe('TerminalJobComponent', () => {
  let component: TerminalJobComponent;
  let fixture: ComponentFixture<TerminalJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
