import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IQcFrontSideComponent } from './i-qc-front-side.component';

describe('IQcFrontSideComponent', () => {
  let component: IQcFrontSideComponent;
  let fixture: ComponentFixture<IQcFrontSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IQcFrontSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IQcFrontSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
