import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsAddComponent } from './tags-add.component';

describe('TagsAddComponent', () => {
  let component: TagsAddComponent;
  let fixture: ComponentFixture<TagsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
