import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TextAnnotationElementDetailComponent } from './text-annotation-element-detail.component';

describe('TextAnnotationElement Management Detail Component', () => {
  let comp: TextAnnotationElementDetailComponent;
  let fixture: ComponentFixture<TextAnnotationElementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnnotationElementDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TextAnnotationElementDetailComponent,
              resolve: { textAnnotationElement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TextAnnotationElementDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnnotationElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load textAnnotationElement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TextAnnotationElementDetailComponent);

      // THEN
      expect(instance.textAnnotationElement()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
