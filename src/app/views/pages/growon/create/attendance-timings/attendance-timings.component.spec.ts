import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTimingsComponent } from './attendance-timings.component';

describe('AttendanceTimingsComponent', () => {
  let component: AttendanceTimingsComponent;
  let fixture: ComponentFixture<AttendanceTimingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceTimingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
