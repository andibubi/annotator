import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAnnotationElement } from '../annotation-element.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../annotation-element.test-samples';

import { AnnotationElementService } from './annotation-element.service';

const requireRestSample: IAnnotationElement = {
  ...sampleWithRequiredData,
};

describe('AnnotationElement Service', () => {
  let service: AnnotationElementService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnnotationElement | IAnnotationElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AnnotationElementService);
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

    it('should create a AnnotationElement', () => {
      const annotationElement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(annotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AnnotationElement', () => {
      const annotationElement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(annotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AnnotationElement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AnnotationElement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AnnotationElement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnnotationElementToCollectionIfMissing', () => {
      it('should add a AnnotationElement to an empty array', () => {
        const annotationElement: IAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addAnnotationElementToCollectionIfMissing([], annotationElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(annotationElement);
      });

      it('should not add a AnnotationElement to an array that contains it', () => {
        const annotationElement: IAnnotationElement = sampleWithRequiredData;
        const annotationElementCollection: IAnnotationElement[] = [
          {
            ...annotationElement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnnotationElementToCollectionIfMissing(annotationElementCollection, annotationElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AnnotationElement to an array that doesn't contain it", () => {
        const annotationElement: IAnnotationElement = sampleWithRequiredData;
        const annotationElementCollection: IAnnotationElement[] = [sampleWithPartialData];
        expectedResult = service.addAnnotationElementToCollectionIfMissing(annotationElementCollection, annotationElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(annotationElement);
      });

      it('should add only unique AnnotationElement to an array', () => {
        const annotationElementArray: IAnnotationElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const annotationElementCollection: IAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addAnnotationElementToCollectionIfMissing(annotationElementCollection, ...annotationElementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const annotationElement: IAnnotationElement = sampleWithRequiredData;
        const annotationElement2: IAnnotationElement = sampleWithPartialData;
        expectedResult = service.addAnnotationElementToCollectionIfMissing([], annotationElement, annotationElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(annotationElement);
        expect(expectedResult).toContain(annotationElement2);
      });

      it('should accept null and undefined values', () => {
        const annotationElement: IAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addAnnotationElementToCollectionIfMissing([], null, annotationElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(annotationElement);
      });

      it('should return initial array if no AnnotationElement is added', () => {
        const annotationElementCollection: IAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addAnnotationElementToCollectionIfMissing(annotationElementCollection, undefined, null);
        expect(expectedResult).toEqual(annotationElementCollection);
      });
    });

    describe('compareAnnotationElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnnotationElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
