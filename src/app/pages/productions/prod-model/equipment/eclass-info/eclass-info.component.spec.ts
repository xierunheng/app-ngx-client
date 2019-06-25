import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclassInfoComponent } from './eclass-info.component';

describe('EclassInfoComponent', () => {
  let component: EclassInfoComponent;
  let fixture: ComponentFixture<EclassInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclassInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
