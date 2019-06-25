import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MolderBodyTrimableComponent } from './molder-body-trimable.component';

describe('MolderBodyTrimableComponent', () => {
  let component: MolderBodyTrimableComponent;
  let fixture: ComponentFixture<MolderBodyTrimableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MolderBodyTrimableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MolderBodyTrimableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
