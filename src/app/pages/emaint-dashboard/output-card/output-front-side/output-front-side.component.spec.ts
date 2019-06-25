import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputFrontSideComponent } from './output-front-side.component';

describe('OutputFrontSideComponent', () => {
  let component: OutputFrontSideComponent;
  let fixture: ComponentFixture<OutputFrontSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputFrontSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputFrontSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
