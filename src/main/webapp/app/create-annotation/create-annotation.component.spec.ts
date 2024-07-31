import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnnotationComponent } from './create-annotation.component';

describe('CreateAnnotationComponent', () => {
  let component: CreateAnnotationComponent;
  let fixture: ComponentFixture<CreateAnnotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnnotationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
