import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyechartPieComponent } from './myechart-pie.component';

describe('MyechartPieComponent', () => {
  let component: MyechartPieComponent;
  let fixture: ComponentFixture<MyechartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyechartPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyechartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
