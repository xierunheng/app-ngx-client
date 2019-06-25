import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaktBackSideComponent } from './takt-back-side.component';

describe('TaktBackSideComponent', () => {
  let component: TaktBackSideComponent;
  let fixture: ComponentFixture<TaktBackSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaktBackSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaktBackSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
