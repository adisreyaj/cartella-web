import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsScreenshotComponent } from './snippets-screenshot.component';

describe('SnippetsScreenshotComponent', () => {
  let component: SnippetsScreenshotComponent;
  let fixture: ComponentFixture<SnippetsScreenshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnippetsScreenshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetsScreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
