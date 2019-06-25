import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsubPanelComponent } from './psub-panel.component';

describe('PsubPanelComponent', () => {
  let component: PsubPanelComponent;
  let fixture: ComponentFixture<PsubPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsubPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsubPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
