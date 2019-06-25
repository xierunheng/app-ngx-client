import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalFooterComponent } from './terminal-footer.component';

describe('TerminalFooterComponent', () => {
  let component: TerminalFooterComponent;
  let fixture: ComponentFixture<TerminalFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
