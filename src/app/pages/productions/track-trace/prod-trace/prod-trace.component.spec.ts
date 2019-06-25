import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdTraceComponent } from './prod-trace.component';

describe('ProdTraceComponent', () => {
  let component: ProdTraceComponent;
  let fixture: ComponentFixture<ProdTraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdTraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
