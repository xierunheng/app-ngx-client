import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldingComponent } from './molding.component';

describe('MoldingComponent', () => {
  let component: MoldingComponent;
  let fixture: ComponentFixture<MoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
