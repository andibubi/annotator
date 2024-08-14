import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ILayout } from 'app/entities/layout/layout.model';
import { LayoutService } from 'app/entities/layout/service/layout.service';
import { GridElementService } from '../service/grid-element.service';
import { IGridElement } from '../grid-element.model';
import { GridElementFormService } from './grid-element-form.service';

import { GridElementUpdateComponent } from './grid-element-update.component';

describe('GridElement Management Update Component', () => {
  let comp: GridElementUpdateComponent;
  let fixture: ComponentFixture<GridElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gridElementFormService: GridElementFormService;
  let gridElementService: GridElementService;
  let layoutService: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridElementUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GridElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GridElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gridElementFormService = TestBed.inject(GridElementFormService);
    gridElementService = TestBed.inject(GridElementService);
    layoutService = TestBed.inject(LayoutService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Layout query and add missing value', () => {
      const gridElement: IGridElement = { id: 456 };
      const layout: ILayout = { id: 20355 };
      gridElement.layout = layout;

      const layoutCollection: ILayout[] = [{ id: 30541 }];
      jest.spyOn(layoutService, 'query').mockReturnValue(of(new HttpResponse({ body: layoutCollection })));
      const additionalLayouts = [layout];
      const expectedCollection: ILayout[] = [...additionalLayouts, ...layoutCollection];
      jest.spyOn(layoutService, 'addLayoutToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gridElement });
      comp.ngOnInit();

      expect(layoutService.query).toHaveBeenCalled();
      expect(layoutService.addLayoutToCollectionIfMissing).toHaveBeenCalledWith(
        layoutCollection,
        ...additionalLayouts.map(expect.objectContaining),
      );
      expect(comp.layoutsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call GridElement query and add missing value', () => {
      const gridElement: IGridElement = { id: 456 };
      const gridElement: IGridElement = { id: 25487 };
      gridElement.gridElement = gridElement;

      const gridElementCollection: IGridElement[] = [{ id: 24527 }];
      jest.spyOn(gridElementService, 'query').mockReturnValue(of(new HttpResponse({ body: gridElementCollection })));
      const additionalGridElements = [gridElement];
      const expectedCollection: IGridElement[] = [...additionalGridElements, ...gridElementCollection];
      jest.spyOn(gridElementService, 'addGridElementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gridElement });
      comp.ngOnInit();

      expect(gridElementService.query).toHaveBeenCalled();
      expect(gridElementService.addGridElementToCollectionIfMissing).toHaveBeenCalledWith(
        gridElementCollection,
        ...additionalGridElements.map(expect.objectContaining),
      );
      expect(comp.gridElementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gridElement: IGridElement = { id: 456 };
      const layout: ILayout = { id: 27878 };
      gridElement.layout = layout;
      const gridElement: IGridElement = { id: 12500 };
      gridElement.gridElement = gridElement;

      activatedRoute.data = of({ gridElement });
      comp.ngOnInit();

      expect(comp.layoutsSharedCollection).toContain(layout);
      expect(comp.gridElementsSharedCollection).toContain(gridElement);
      expect(comp.gridElement).toEqual(gridElement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridElement>>();
      const gridElement = { id: 123 };
      jest.spyOn(gridElementFormService, 'getGridElement').mockReturnValue(gridElement);
      jest.spyOn(gridElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridElement }));
      saveSubject.complete();

      // THEN
      expect(gridElementFormService.getGridElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gridElementService.update).toHaveBeenCalledWith(expect.objectContaining(gridElement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridElement>>();
      const gridElement = { id: 123 };
      jest.spyOn(gridElementFormService, 'getGridElement').mockReturnValue({ id: null });
      jest.spyOn(gridElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridElement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridElement }));
      saveSubject.complete();

      // THEN
      expect(gridElementFormService.getGridElement).toHaveBeenCalled();
      expect(gridElementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridElement>>();
      const gridElement = { id: 123 };
      jest.spyOn(gridElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gridElementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLayout', () => {
      it('Should forward to layoutService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(layoutService, 'compareLayout');
        comp.compareLayout(entity, entity2);
        expect(layoutService.compareLayout).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGridElement', () => {
      it('Should forward to gridElementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gridElementService, 'compareGridElement');
        comp.compareGridElement(entity, entity2);
        expect(gridElementService.compareGridElement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
