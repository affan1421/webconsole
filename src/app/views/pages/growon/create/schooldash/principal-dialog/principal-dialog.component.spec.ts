import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDialogComponent } from './principal-dialog.component';

describe('PrincipalDialogComponent', () => {
  let component: PrincipalDialogComponent;
  let fixture: ComponentFixture<PrincipalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
