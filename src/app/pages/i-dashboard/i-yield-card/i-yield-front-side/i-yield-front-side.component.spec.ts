import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IYieldFrontSideComponent } from './i-yield-front-side.component';

describe('IYieldFrontSideComponent', () => {
  let component: IYieldFrontSideComponent;
  let fixture: ComponentFixture<IYieldFrontSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IYieldFrontSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IYieldFrontSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
