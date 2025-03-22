import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BttComponent } from './btt.component';

describe('BttComponent', () => {
  let component: BttComponent;
  let fixture: ComponentFixture<BttComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BttComponent]
    });
    fixture = TestBed.createComponent(BttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
