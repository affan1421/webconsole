import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDownloadDialogComponent } from './profile-download-dialog.component';

describe('ProfileDownloadDialogComponent', () => {
  let component: ProfileDownloadDialogComponent;
  let fixture: ComponentFixture<ProfileDownloadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDownloadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
