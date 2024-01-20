import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolDataComponent } from './school-data.component';

describe('SchoolDataComponent', () => {
  let component: SchoolDataComponent;
  let fixture: ComponentFixture<SchoolDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
