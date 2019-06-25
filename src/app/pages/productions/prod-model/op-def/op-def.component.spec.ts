import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDefComponent } from './op-def.component';

describe('OpDefComponent', () => {
  let component: OpDefComponent;
  let fixture: ComponentFixture<OpDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
