import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IYieldBackSideComponent } from './i-yield-back-side.component';

describe('IYieldBackSideComponent', () => {
  let component: IYieldBackSideComponent;
  let fixture: ComponentFixture<IYieldBackSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IYieldBackSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IYieldBackSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
