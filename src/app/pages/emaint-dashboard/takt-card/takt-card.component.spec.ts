import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaktCardComponent } from './takt-card.component';

describe('TaktCardComponent', () => {
  let component: TaktCardComponent;
  let fixture: ComponentFixture<TaktCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaktCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaktCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
