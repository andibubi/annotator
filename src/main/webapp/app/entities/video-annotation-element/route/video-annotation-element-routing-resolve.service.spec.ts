import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IVideoAnnotationElement } from '../video-annotation-element.model';
import { VideoAnnotationElementService } from '../service/video-annotation-element.service';

import videoAnnotationElementResolve from './video-annotation-element-routing-resolve.service';

describe('VideoAnnotationElement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: VideoAnnotationElementService;
  let resultVideoAnnotationElement: IVideoAnnotationElement | null | undefined;

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
    service = TestBed.inject(VideoAnnotationElementService);
    resultVideoAnnotationElement = undefined;
  });

  describe('resolve', () => {
    it('should return IVideoAnnotationElement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        videoAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultVideoAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultVideoAnnotationElement).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        videoAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultVideoAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultVideoAnnotationElement).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IVideoAnnotationElement>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        videoAnnotationElementResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultVideoAnnotationElement = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultVideoAnnotationElement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
