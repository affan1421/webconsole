import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentStatsComponent } from './assigment-stats.component';

describe('AssigmentStatsComponent', () => {
  let component: AssigmentStatsComponent;
  let fixture: ComponentFixture<AssigmentStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigmentStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigmentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
