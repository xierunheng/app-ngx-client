import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeMultiSelectComponent } from './tree-multi-select.component';

describe('TreeMultiSelectComponent', () => {
  let component: TreeMultiSelectComponent;
  let fixture: ComponentFixture<TreeMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
