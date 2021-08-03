import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToFolderComponent } from './move-to-folder.component';

describe('MoveToFolderComponent', () => {
  let component: MoveToFolderComponent;
  let fixture: ComponentFixture<MoveToFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveToFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
