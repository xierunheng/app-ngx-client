import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IThCardsHeaderComponent } from './i-th-cards-header.component';

describe('IThCardsHeaderComponent', () => {
  let component: IThCardsHeaderComponent;
  let fixture: ComponentFixture<IThCardsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IThCardsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IThCardsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
