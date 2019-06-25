import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCardComponent } from './output-card.component';

describe('OutputCardComponent', () => {
  let component: OutputCardComponent;
  let fixture: ComponentFixture<OutputCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
