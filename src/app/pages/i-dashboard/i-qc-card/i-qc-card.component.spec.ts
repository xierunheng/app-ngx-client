import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IQcCardComponent } from './i-qc-card.component';

describe('IQcCardComponent', () => {
  let component: IQcCardComponent;
  let fixture: ComponentFixture<IQcCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IQcCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IQcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
