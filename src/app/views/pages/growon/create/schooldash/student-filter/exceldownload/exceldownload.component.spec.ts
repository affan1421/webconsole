import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceldownloadComponent } from './exceldownload.component';

describe('ExceldownloadComponent', () => {
  let component: ExceldownloadComponent;
  let fixture: ComponentFixture<ExceldownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceldownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceldownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
