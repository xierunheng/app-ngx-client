import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsubShowComponent } from './psub-show.component';

describe('PsubShowComponent', () => {
  let component: PsubShowComponent;
  let fixture: ComponentFixture<PsubShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsubShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsubShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
