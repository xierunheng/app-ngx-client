import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlotComponent } from './mlot.component';

describe('MlotComponent', () => {
  let component: MlotComponent;
  let fixture: ComponentFixture<MlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
