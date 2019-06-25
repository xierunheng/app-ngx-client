import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingQCComponent } from './packingqc.component';

describe('PackingQCComponent', () => {
  let component: PackingQCComponent;
  let fixture: ComponentFixture<PackingQCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingQCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
