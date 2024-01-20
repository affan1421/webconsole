import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignupDialogComponent } from './user-signup-dialog.component';

describe('UserSignupDialogComponent', () => {
  let component: UserSignupDialogComponent;
  let fixture: ComponentFixture<UserSignupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
