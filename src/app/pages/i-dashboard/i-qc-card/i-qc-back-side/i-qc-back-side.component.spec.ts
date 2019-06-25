import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IQcBackSideComponent } from './i-qc-back-side.component';

describe('IQcBackSideComponent', () => {
  let component: IQcBackSideComponent;
  let fixture: ComponentFixture<IQcBackSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IQcBackSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IQcBackSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
