import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { VideoAnnotationElementDetailComponent } from './video-annotation-element-detail.component';

describe('VideoAnnotationElement Management Detail Component', () => {
  let comp: VideoAnnotationElementDetailComponent;
  let fixture: ComponentFixture<VideoAnnotationElementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoAnnotationElementDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: VideoAnnotationElementDetailComponent,
              resolve: { videoAnnotationElement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VideoAnnotationElementDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAnnotationElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load videoAnnotationElement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VideoAnnotationElementDetailComponent);

      // THEN
      expect(instance.videoAnnotationElement()).toEqual(expect.objectContaining({ id: 123 }));
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
