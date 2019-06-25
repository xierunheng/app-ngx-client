import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalKbComponent } from './total-kb.component';

describe('TotalKbComponent', () => {
  let component: TotalKbComponent;
  let fixture: ComponentFixture<TotalKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
