import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbTitleComponent } from './kb-title.component';

describe('KbTitleComponent', () => {
  let component: KbTitleComponent;
  let fixture: ComponentFixture<KbTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
