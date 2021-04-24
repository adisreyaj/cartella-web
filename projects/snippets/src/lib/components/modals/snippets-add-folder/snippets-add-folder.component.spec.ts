import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsAddFolderComponent } from './snippets-add-folder.component';

describe('SnippetsAddFolderComponent', () => {
  let component: SnippetsAddFolderComponent;
  let fixture: ComponentFixture<SnippetsAddFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnippetsAddFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetsAddFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
