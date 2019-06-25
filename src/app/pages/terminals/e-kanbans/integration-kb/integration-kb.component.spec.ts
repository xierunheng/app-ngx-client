import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationKbComponent } from './integration-kb.component';

describe('IntegrationKbComponent', () => {
  let component: IntegrationKbComponent;
  let fixture: ComponentFixture<IntegrationKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
