import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IYieldCardComponent } from './i-yield-card.component';

describe('IYieldCardComponent', () => {
  let component: IYieldCardComponent;
  let fixture: ComponentFixture<IYieldCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IYieldCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IYieldCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
