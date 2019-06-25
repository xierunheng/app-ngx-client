import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaintProgressComponent } from './emaint-progress.component';

describe('EmaintProgressComponent', () => {
  let component: EmaintProgressComponent;
  let fixture: ComponentFixture<EmaintProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaintProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaintProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
