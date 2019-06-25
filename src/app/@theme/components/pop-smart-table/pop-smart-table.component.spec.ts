import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopSmartTableComponent } from './pop-smart-table.component';

describe('PopSmartTableComponent', () => {
  let component: PopSmartTableComponent;
  let fixture: ComponentFixture<PopSmartTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopSmartTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
