import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptFactoryComponent } from './prompt-factory.component';

describe('PromptFactoryComponent', () => {
  let component: PromptFactoryComponent;
  let fixture: ComponentFixture<PromptFactoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptFactoryComponent]
    });
    fixture = TestBed.createComponent(PromptFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
