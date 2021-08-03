import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerSidebarComponent } from './explorer-sidebar.component';

describe('ExplorerSidebarComponent', () => {
  let component: ExplorerSidebarComponent;
  let fixture: ComponentFixture<ExplorerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorerSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
