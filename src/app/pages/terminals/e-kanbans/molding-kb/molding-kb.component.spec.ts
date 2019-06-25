import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldingKbComponent } from './molding-kb.component';

describe('MoldingKbComponent', () => {
  let component: MoldingKbComponent;
  let fixture: ComponentFixture<MoldingKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoldingKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldingKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
