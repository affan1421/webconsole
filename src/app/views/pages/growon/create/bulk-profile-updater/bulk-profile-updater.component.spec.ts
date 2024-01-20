import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkProfileUpdaterComponent } from './bulk-profile-updater.component';

describe('BulkProfileUpdaterComponent', () => {
  let component: BulkProfileUpdaterComponent;
  let fixture: ComponentFixture<BulkProfileUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkProfileUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkProfileUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
