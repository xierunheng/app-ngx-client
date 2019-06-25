import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IProgressSectionComponent } from './i-progress-section.component';

describe('IProgressSectionComponent', () => {
  let component: IProgressSectionComponent;
  let fixture: ComponentFixture<IProgressSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IProgressSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IProgressSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
