import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsegComponent } from './proseg.component';

describe('ProsegComponent', () => {
  let component: ProsegComponent;
  let fixture: ComponentFixture<ProsegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
