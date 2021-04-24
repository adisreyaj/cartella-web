import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesListComponent } from './packages-list.component';

describe('PackagesListComponent', () => {
  let component: PackagesListComponent;
  let fixture: ComponentFixture<PackagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
