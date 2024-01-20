import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementFiltersComponent } from './management-filters.component';

describe('ManagementFiltersComponent', () => {
  let component: ManagementFiltersComponent;
  let fixture: ComponentFixture<ManagementFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
