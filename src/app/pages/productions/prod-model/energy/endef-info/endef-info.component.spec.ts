import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndefInfoComponent } from './endef-info.component';

describe('EndefInfoComponent', () => {
  let component: EndefInfoComponent;
  let fixture: ComponentFixture<EndefInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndefInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
