import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GridElementDetailComponent } from './grid-element-detail.component';

describe('GridElement Management Detail Component', () => {
  let comp: GridElementDetailComponent;
  let fixture: ComponentFixture<GridElementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridElementDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GridElementDetailComponent,
              resolve: { gridElement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GridElementDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load gridElement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GridElementDetailComponent);

      // THEN
      expect(instance.gridElement()).toEqual(expect.objectContaining({ id: 123 }));
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
