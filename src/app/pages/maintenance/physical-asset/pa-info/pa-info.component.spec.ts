import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaInfoComponent } from './pa-info.component';

describe('PaInfoComponent', () => {
  let component: PaInfoComponent;
  let fixture: ComponentFixture<PaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
