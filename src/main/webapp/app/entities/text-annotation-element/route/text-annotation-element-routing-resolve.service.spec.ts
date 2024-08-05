import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ITextAnnotationElement } from '../text-annotation-element.model';
import { TextAnnotationElementService } from '../service/text-annotation-element.service';

import textAnnotationElementResolve from './text-annotation-element-routing-resolve.service';

describe('TextAnnotationElement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: TextAnnotationElementService;
  let resultTextAnnotationElement: ITextAnnotationElement | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(TextAnnotationElementService);
    resultTextAnnotationElement = undefined;
  });

  describe('resolve', () => {
    it('should return ITextAnnotationElement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        textAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultTextAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTextAnnotationElement).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        textAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultTextAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTextAnnotationElement).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ITextAnnotationElement>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        textAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultTextAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTextAnnotationElement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
