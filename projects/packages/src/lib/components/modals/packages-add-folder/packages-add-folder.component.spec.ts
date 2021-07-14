import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesAddFolderComponent } from './packages-add-folder.component';

describe('PackagesAddFolderComponent', () => {
  let component: PackagesAddFolderComponent;
  let fixture: ComponentFixture<PackagesAddFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesAddFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesAddFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
