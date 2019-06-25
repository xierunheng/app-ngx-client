import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IThBackSideComponent } from './i-th-back-side.component';

describe('IThBackSideComponent', () => {
  let component: IThBackSideComponent;
  let fixture: ComponentFixture<IThBackSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IThBackSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IThBackSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
