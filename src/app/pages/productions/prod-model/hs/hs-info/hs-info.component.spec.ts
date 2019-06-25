import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsInfoComponent } from './hs-info.component';

describe('HsInfoComponent', () => {
  let component: HsInfoComponent;
  let fixture: ComponentFixture<HsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
