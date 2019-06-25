import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputBackSideComponent } from './output-back-side.component';

describe('OutputBackSideComponent', () => {
  let component: OutputBackSideComponent;
  let fixture: ComponentFixture<OutputBackSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputBackSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputBackSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
