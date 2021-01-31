import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsPlaygroundComponent } from './snippets-playground.component';

describe('SnippetsPlaygroundComponent', () => {
  let component: SnippetsPlaygroundComponent;
  let fixture: ComponentFixture<SnippetsPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnippetsPlaygroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetsPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
