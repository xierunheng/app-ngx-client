import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsPopComponent } from './hs-pop.component';

describe('HsPopComponent', () => {
  let component: HsPopComponent;
  let fixture: ComponentFixture<HsPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
