import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalFilterComponent } from './principal-filter.component';

describe('PrincipalFilterComponent', () => {
  let component: PrincipalFilterComponent;
  let fixture: ComponentFixture<PrincipalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
