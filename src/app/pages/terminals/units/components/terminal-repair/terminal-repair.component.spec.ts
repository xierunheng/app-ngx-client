import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalRepairComponent } from './terminal-repair.component';

describe('TerminalRepairComponent', () => {
  let component: TerminalRepairComponent;
  let fixture: ComponentFixture<TerminalRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
