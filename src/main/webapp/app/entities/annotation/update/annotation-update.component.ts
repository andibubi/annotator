import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IAnnotation } from '../annotation.model';
import { AnnotationService } from '../service/annotation.service';
import { AnnotationFormService, AnnotationFormGroup } from './annotation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-annotation-update',
  templateUrl: './annotation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AnnotationUpdateComponent implements OnInit {
  isSaving = false;
  annotation: IAnnotation | null = null;

  annotationsSharedCollection: IAnnotation[] = [];
  usersSharedCollection: IUser[] = [];

  protected annotationService = inject(AnnotationService);
  protected annotationFormService = inject(AnnotationFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AnnotationFormGroup = this.annotationFormService.createAnnotationFormGroup();

  compareAnnotation = (o1: IAnnotation | null, o2: IAnnotation | null): boolean => this.annotationService.compareAnnotation(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ annotation }) => {
      this.annotation = annotation;
      if (annotation) {
        this.updateForm(annotation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const annotation = this.annotationFormService.getAnnotation(this.editForm);
    if (annotation.id !== null) {
      this.subscribeToSaveResponse(this.annotationService.update(annotation));
    } else {
      this.subscribeToSaveResponse(this.annotationService.create(annotation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnnotation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(annotation: IAnnotation): void {
    this.annotation = annotation;
    this.annotationFormService.resetForm(this.editForm, annotation);

    this.annotationsSharedCollection = this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(
      this.annotationsSharedCollection,
      annotation.ancestor,
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, annotation.user);
  }

  protected loadRelationshipsOptions(): void {
    this.annotationService
      .query()
      .pipe(map((res: HttpResponse<IAnnotation[]>) => res.body ?? []))
      .pipe(
        map((annotations: IAnnotation[]) =>
          this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(annotations, this.annotation?.ancestor),
        ),
      )
      .subscribe((annotations: IAnnotation[]) => (this.annotationsSharedCollection = annotations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.annotation?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
