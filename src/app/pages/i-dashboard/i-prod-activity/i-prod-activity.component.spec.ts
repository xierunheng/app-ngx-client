import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IProdActivityComponent } from './i-prod-activity.component';

describe('IProdActivityComponent', () => {
  let component: IProdActivityComponent;
  let fixture: ComponentFixture<IProdActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IProdActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IProdActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
