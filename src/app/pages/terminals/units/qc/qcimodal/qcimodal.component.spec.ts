import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcimodalComponent } from './qcimodal.component';

describe('QcimodalComponent', () => {
  let component: QcimodalComponent;
  let fixture: ComponentFixture<QcimodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcimodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcimodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
