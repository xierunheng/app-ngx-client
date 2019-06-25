import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MclassInfoComponent } from './mclass-info.component';

describe('MclassInfoComponent', () => {
  let component: MclassInfoComponent;
  let fixture: ComponentFixture<MclassInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MclassInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MclassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
