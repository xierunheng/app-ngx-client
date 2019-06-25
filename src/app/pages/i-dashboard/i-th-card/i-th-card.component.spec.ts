import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IThCardComponent } from './i-th-card.component';

describe('IThCardComponent', () => {
  let component: IThCardComponent;
  let fixture: ComponentFixture<IThCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IThCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IThCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
