import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAnnotation } from '../annotation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../annotation.test-samples';

import { AnnotationService } from './annotation.service';

const requireRestSample: IAnnotation = {
  ...sampleWithRequiredData,
};

describe('Annotation Service', () => {
  let service: AnnotationService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnnotation | IAnnotation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AnnotationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Annotation', () => {
      const annotation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(annotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Annotation', () => {
      const annotation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(annotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Annotation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Annotation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Annotation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnnotationToCollectionIfMissing', () => {
      it('should add a Annotation to an empty array', () => {
        const annotation: IAnnotation = sampleWithRequiredData;
        expectedResult = service.addAnnotationToCollectionIfMissing([], annotation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(annotation);
      });

      it('should not add a Annotation to an array that contains it', () => {
        const annotation: IAnnotation = sampleWithRequiredData;
        const annotationCollection: IAnnotation[] = [
          {
            ...annotation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnnotationToCollectionIfMissing(annotationCollection, annotation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Annotation to an array that doesn't contain it", () => {
        const annotation: IAnnotation = sampleWithRequiredData;
        const annotationCollection: IAnnotation[] = [sampleWithPartialData];
        expectedResult = service.addAnnotationToCollectionIfMissing(annotationCollection, annotation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(annotation);
      });

      it('should add only unique Annotation to an array', () => {
        const annotationArray: IAnnotation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const annotationCollection: IAnnotation[] = [sampleWithRequiredData];
        expectedResult = service.addAnnotationToCollectionIfMissing(annotationCollection, ...annotationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const annotation: IAnnotation = sampleWithRequiredData;
        const annotation2: IAnnotation = sampleWithPartialData;
        expectedResult = service.addAnnotationToCollectionIfMissing([], annotation, annotation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(annotation);
        expect(expectedResult).toContain(annotation2);
      });

      it('should accept null and undefined values', () => {
        const annotation: IAnnotation = sampleWithRequiredData;
        expectedResult = service.addAnnotationToCollectionIfMissing([], null, annotation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(annotation);
      });

      it('should return initial array if no Annotation is added', () => {
        const annotationCollection: IAnnotation[] = [sampleWithRequiredData];
        expectedResult = service.addAnnotationToCollectionIfMissing(annotationCollection, undefined, null);
        expect(expectedResult).toEqual(annotationCollection);
      });
    });

    describe('compareAnnotation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnnotation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAnnotation(entity1, entity2);
        const compareResult2 = service.compareAnnotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAnnotation(entity1, entity2);
        const compareResult2 = service.compareAnnotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAnnotation(entity1, entity2);
        const compareResult2 = service.compareAnnotation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
