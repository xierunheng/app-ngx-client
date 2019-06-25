import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaInfoComponent } from './para-info.component';

describe('ParaInfoComponent', () => {
  let component: ParaInfoComponent;
  let fixture: ComponentFixture<ParaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
