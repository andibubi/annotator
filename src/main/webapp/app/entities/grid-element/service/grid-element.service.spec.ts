import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGridElement } from '../grid-element.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../grid-element.test-samples';

import { GridElementService } from './grid-element.service';

const requireRestSample: IGridElement = {
  ...sampleWithRequiredData,
};

describe('GridElement Service', () => {
  let service: GridElementService;
  let httpMock: HttpTestingController;
  let expectedResult: IGridElement | IGridElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GridElementService);
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

    it('should create a GridElement', () => {
      const gridElement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gridElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GridElement', () => {
      const gridElement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gridElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GridElement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GridElement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GridElement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGridElementToCollectionIfMissing', () => {
      it('should add a GridElement to an empty array', () => {
        const gridElement: IGridElement = sampleWithRequiredData;
        expectedResult = service.addGridElementToCollectionIfMissing([], gridElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridElement);
      });

      it('should not add a GridElement to an array that contains it', () => {
        const gridElement: IGridElement = sampleWithRequiredData;
        const gridElementCollection: IGridElement[] = [
          {
            ...gridElement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGridElementToCollectionIfMissing(gridElementCollection, gridElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GridElement to an array that doesn't contain it", () => {
        const gridElement: IGridElement = sampleWithRequiredData;
        const gridElementCollection: IGridElement[] = [sampleWithPartialData];
        expectedResult = service.addGridElementToCollectionIfMissing(gridElementCollection, gridElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridElement);
      });

      it('should add only unique GridElement to an array', () => {
        const gridElementArray: IGridElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gridElementCollection: IGridElement[] = [sampleWithRequiredData];
        expectedResult = service.addGridElementToCollectionIfMissing(gridElementCollection, ...gridElementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gridElement: IGridElement = sampleWithRequiredData;
        const gridElement2: IGridElement = sampleWithPartialData;
        expectedResult = service.addGridElementToCollectionIfMissing([], gridElement, gridElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridElement);
        expect(expectedResult).toContain(gridElement2);
      });

      it('should accept null and undefined values', () => {
        const gridElement: IGridElement = sampleWithRequiredData;
        expectedResult = service.addGridElementToCollectionIfMissing([], null, gridElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridElement);
      });

      it('should return initial array if no GridElement is added', () => {
        const gridElementCollection: IGridElement[] = [sampleWithRequiredData];
        expectedResult = service.addGridElementToCollectionIfMissing(gridElementCollection, undefined, null);
        expect(expectedResult).toEqual(gridElementCollection);
      });
    });

    describe('compareGridElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGridElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGridElement(entity1, entity2);
        const compareResult2 = service.compareGridElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGridElement(entity1, entity2);
        const compareResult2 = service.compareGridElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGridElement(entity1, entity2);
        const compareResult2 = service.compareGridElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
