import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDefInfoComponent } from './op-def-info.component';

describe('OpDefInfoComponent', () => {
  let component: OpDefInfoComponent;
  let fixture: ComponentFixture<OpDefInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpDefInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpDefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
