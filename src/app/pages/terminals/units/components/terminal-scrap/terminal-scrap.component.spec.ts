import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalScrapComponent } from './terminal-scrap.component';

describe('TerminalScrapComponent', () => {
  let component: TerminalScrapComponent;
  let fixture: ComponentFixture<TerminalScrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalScrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
