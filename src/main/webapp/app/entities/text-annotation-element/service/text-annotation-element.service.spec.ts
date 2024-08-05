import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITextAnnotationElement } from '../text-annotation-element.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../text-annotation-element.test-samples';

import { TextAnnotationElementService } from './text-annotation-element.service';

const requireRestSample: ITextAnnotationElement = {
  ...sampleWithRequiredData,
};

describe('TextAnnotationElement Service', () => {
  let service: TextAnnotationElementService;
  let httpMock: HttpTestingController;
  let expectedResult: ITextAnnotationElement | ITextAnnotationElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TextAnnotationElementService);
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

    it('should create a TextAnnotationElement', () => {
      const textAnnotationElement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(textAnnotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TextAnnotationElement', () => {
      const textAnnotationElement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(textAnnotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TextAnnotationElement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TextAnnotationElement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TextAnnotationElement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTextAnnotationElementToCollectionIfMissing', () => {
      it('should add a TextAnnotationElement to an empty array', () => {
        const textAnnotationElement: ITextAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing([], textAnnotationElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textAnnotationElement);
      });

      it('should not add a TextAnnotationElement to an array that contains it', () => {
        const textAnnotationElement: ITextAnnotationElement = sampleWithRequiredData;
        const textAnnotationElementCollection: ITextAnnotationElement[] = [
          {
            ...textAnnotationElement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing(textAnnotationElementCollection, textAnnotationElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TextAnnotationElement to an array that doesn't contain it", () => {
        const textAnnotationElement: ITextAnnotationElement = sampleWithRequiredData;
        const textAnnotationElementCollection: ITextAnnotationElement[] = [sampleWithPartialData];
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing(textAnnotationElementCollection, textAnnotationElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textAnnotationElement);
      });

      it('should add only unique TextAnnotationElement to an array', () => {
        const textAnnotationElementArray: ITextAnnotationElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const textAnnotationElementCollection: ITextAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing(
          textAnnotationElementCollection,
          ...textAnnotationElementArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const textAnnotationElement: ITextAnnotationElement = sampleWithRequiredData;
        const textAnnotationElement2: ITextAnnotationElement = sampleWithPartialData;
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing([], textAnnotationElement, textAnnotationElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textAnnotationElement);
        expect(expectedResult).toContain(textAnnotationElement2);
      });

      it('should accept null and undefined values', () => {
        const textAnnotationElement: ITextAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing([], null, textAnnotationElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textAnnotationElement);
      });

      it('should return initial array if no TextAnnotationElement is added', () => {
        const textAnnotationElementCollection: ITextAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addTextAnnotationElementToCollectionIfMissing(textAnnotationElementCollection, undefined, null);
        expect(expectedResult).toEqual(textAnnotationElementCollection);
      });
    });

    describe('compareTextAnnotationElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTextAnnotationElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTextAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareTextAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTextAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareTextAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTextAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareTextAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
