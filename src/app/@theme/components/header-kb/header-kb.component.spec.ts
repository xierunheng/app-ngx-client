import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderKbComponent } from './header-kb.component';

describe('HeaderKbComponent', () => {
  let component: HeaderKbComponent;
  let fixture: ComponentFixture<HeaderKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
