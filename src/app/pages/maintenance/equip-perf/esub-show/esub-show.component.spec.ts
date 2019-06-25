import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsubShowComponent } from './esub-show.component';

describe('EsubShowComponent', () => {
  let component: EsubShowComponent;
  let fixture: ComponentFixture<EsubShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsubShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsubShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
