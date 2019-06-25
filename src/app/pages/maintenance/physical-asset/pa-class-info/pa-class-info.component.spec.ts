import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaClassInfoComponent } from './pa-class-info.component';

describe('PaClassInfoComponent', () => {
  let component: PaClassInfoComponent;
  let fixture: ComponentFixture<PaClassInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaClassInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaClassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
