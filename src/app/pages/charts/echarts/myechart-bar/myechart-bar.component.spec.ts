import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyechartBarComponent } from './myechart-bar.component';

describe('MyechartBarComponent', () => {
  let component: MyechartBarComponent;
  let fixture: ComponentFixture<MyechartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyechartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyechartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
