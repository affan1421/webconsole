import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMappingComponent } from './new-mapping.component';

describe('NewMappingComponent', () => {
  let component: NewMappingComponent;
  let fixture: ComponentFixture<NewMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
