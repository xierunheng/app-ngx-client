import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaktFrontSideComponent } from './takt-front-side.component';

describe('TaktFrontSideComponent', () => {
  let component: TaktFrontSideComponent;
  let fixture: ComponentFixture<TaktFrontSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaktFrontSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaktFrontSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
