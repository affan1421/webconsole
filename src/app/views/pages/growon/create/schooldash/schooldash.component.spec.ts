import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchooldashComponent } from './schooldash.component';

describe('SchooldashComponent', () => {
  let component: SchooldashComponent;
  let fixture: ComponentFixture<SchooldashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchooldashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchooldashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
