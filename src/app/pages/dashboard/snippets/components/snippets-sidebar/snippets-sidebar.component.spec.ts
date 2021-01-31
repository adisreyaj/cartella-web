import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsSidebarComponent } from './snippets-sidebar.component';

describe('SnippetsSidebarComponent', () => {
  let component: SnippetsSidebarComponent;
  let fixture: ComponentFixture<SnippetsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnippetsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
