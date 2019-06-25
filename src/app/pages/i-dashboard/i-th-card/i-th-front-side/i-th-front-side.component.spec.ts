import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IThFrontSideComponent } from './i-th-front-side.component';

describe('IThFrontSideComponent', () => {
  let component: IThFrontSideComponent;
  let fixture: ComponentFixture<IThFrontSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IThFrontSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IThFrontSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
