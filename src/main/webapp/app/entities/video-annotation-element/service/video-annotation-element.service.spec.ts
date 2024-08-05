import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVideoAnnotationElement } from '../video-annotation-element.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../video-annotation-element.test-samples';

import { VideoAnnotationElementService } from './video-annotation-element.service';

const requireRestSample: IVideoAnnotationElement = {
  ...sampleWithRequiredData,
};

describe('VideoAnnotationElement Service', () => {
  let service: VideoAnnotationElementService;
  let httpMock: HttpTestingController;
  let expectedResult: IVideoAnnotationElement | IVideoAnnotationElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VideoAnnotationElementService);
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

    it('should create a VideoAnnotationElement', () => {
      const videoAnnotationElement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(videoAnnotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VideoAnnotationElement', () => {
      const videoAnnotationElement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(videoAnnotationElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VideoAnnotationElement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VideoAnnotationElement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VideoAnnotationElement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVideoAnnotationElementToCollectionIfMissing', () => {
      it('should add a VideoAnnotationElement to an empty array', () => {
        const videoAnnotationElement: IVideoAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing([], videoAnnotationElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(videoAnnotationElement);
      });

      it('should not add a VideoAnnotationElement to an array that contains it', () => {
        const videoAnnotationElement: IVideoAnnotationElement = sampleWithRequiredData;
        const videoAnnotationElementCollection: IVideoAnnotationElement[] = [
          {
            ...videoAnnotationElement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing(videoAnnotationElementCollection, videoAnnotationElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VideoAnnotationElement to an array that doesn't contain it", () => {
        const videoAnnotationElement: IVideoAnnotationElement = sampleWithRequiredData;
        const videoAnnotationElementCollection: IVideoAnnotationElement[] = [sampleWithPartialData];
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing(videoAnnotationElementCollection, videoAnnotationElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(videoAnnotationElement);
      });

      it('should add only unique VideoAnnotationElement to an array', () => {
        const videoAnnotationElementArray: IVideoAnnotationElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const videoAnnotationElementCollection: IVideoAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing(
          videoAnnotationElementCollection,
          ...videoAnnotationElementArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const videoAnnotationElement: IVideoAnnotationElement = sampleWithRequiredData;
        const videoAnnotationElement2: IVideoAnnotationElement = sampleWithPartialData;
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing([], videoAnnotationElement, videoAnnotationElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(videoAnnotationElement);
        expect(expectedResult).toContain(videoAnnotationElement2);
      });

      it('should accept null and undefined values', () => {
        const videoAnnotationElement: IVideoAnnotationElement = sampleWithRequiredData;
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing([], null, videoAnnotationElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(videoAnnotationElement);
      });

      it('should return initial array if no VideoAnnotationElement is added', () => {
        const videoAnnotationElementCollection: IVideoAnnotationElement[] = [sampleWithRequiredData];
        expectedResult = service.addVideoAnnotationElementToCollectionIfMissing(videoAnnotationElementCollection, undefined, null);
        expect(expectedResult).toEqual(videoAnnotationElementCollection);
      });
    });

    describe('compareVideoAnnotationElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVideoAnnotationElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVideoAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareVideoAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVideoAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareVideoAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVideoAnnotationElement(entity1, entity2);
        const compareResult2 = service.compareVideoAnnotationElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
