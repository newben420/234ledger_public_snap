import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSqlComponent } from './custom-sql.component';

describe('CustomSqlComponent', () => {
  let component: CustomSqlComponent;
  let fixture: ComponentFixture<CustomSqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSqlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
