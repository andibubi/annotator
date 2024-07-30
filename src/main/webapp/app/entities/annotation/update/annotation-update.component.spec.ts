import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { AnnotationService } from '../service/annotation.service';
import { IAnnotation } from '../annotation.model';
import { AnnotationFormService } from './annotation-form.service';

import { AnnotationUpdateComponent } from './annotation-update.component';

describe('Annotation Management Update Component', () => {
  let comp: AnnotationUpdateComponent;
  let fixture: ComponentFixture<AnnotationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let annotationFormService: AnnotationFormService;
  let annotationService: AnnotationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnnotationUpdateComponent],
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
      .overrideTemplate(AnnotationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnnotationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    annotationFormService = TestBed.inject(AnnotationFormService);
    annotationService = TestBed.inject(AnnotationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const annotation: IAnnotation = { id: 456 };
      const user: IUser = { id: 31426 };
      annotation.user = user;

      const userCollection: IUser[] = [{ id: 12177 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ annotation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const annotation: IAnnotation = { id: 456 };
      const user: IUser = { id: 13562 };
      annotation.user = user;

      activatedRoute.data = of({ annotation });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.annotation).toEqual(annotation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotation>>();
      const annotation = { id: 123 };
      jest.spyOn(annotationFormService, 'getAnnotation').mockReturnValue(annotation);
      jest.spyOn(annotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: annotation }));
      saveSubject.complete();

      // THEN
      expect(annotationFormService.getAnnotation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(annotationService.update).toHaveBeenCalledWith(expect.objectContaining(annotation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotation>>();
      const annotation = { id: 123 };
      jest.spyOn(annotationFormService, 'getAnnotation').mockReturnValue({ id: null });
      jest.spyOn(annotationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: annotation }));
      saveSubject.complete();

      // THEN
      expect(annotationFormService.getAnnotation).toHaveBeenCalled();
      expect(annotationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotation>>();
      const annotation = { id: 123 };
      jest.spyOn(annotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(annotationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
