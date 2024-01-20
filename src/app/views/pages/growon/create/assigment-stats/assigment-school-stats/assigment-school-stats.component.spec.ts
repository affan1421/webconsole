import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentSchoolStatsComponent } from './assigment-school-stats.component';

describe('AssigmentSchoolStatsComponent', () => {
  let component: AssigmentSchoolStatsComponent;
  let fixture: ComponentFixture<AssigmentSchoolStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigmentSchoolStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigmentSchoolStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
