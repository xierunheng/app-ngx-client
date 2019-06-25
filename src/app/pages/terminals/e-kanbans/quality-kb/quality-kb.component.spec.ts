import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityKbComponent } from './quality-kb.component';

describe('QualityKbComponent', () => {
  let component: QualityKbComponent;
  let fixture: ComponentFixture<QualityKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
