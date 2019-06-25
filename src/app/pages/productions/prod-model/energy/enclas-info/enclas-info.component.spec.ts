import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnclasInfoComponent } from './enclas-info.component';

describe('EnclasInfoComponent', () => {
  let component: EnclasInfoComponent;
  let fixture: ComponentFixture<EnclasInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnclasInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnclasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
