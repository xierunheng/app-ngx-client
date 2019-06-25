import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsegInfoComponent } from './proseg-info.component';

describe('ProsegInfoComponent', () => {
  let component: ProsegInfoComponent;
  let fixture: ComponentFixture<ProsegInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsegInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsegInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
