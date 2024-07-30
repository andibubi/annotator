import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { IAnnotationElement } from '../annotation-element.model';
import { AnnotationElementService } from '../service/annotation-element.service';
import { AnnotationElementFormService, AnnotationElementFormGroup } from './annotation-element-form.service';

@Component({
  standalone: true,
  selector: 'jhi-annotation-element-update',
  templateUrl: './annotation-element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AnnotationElementUpdateComponent implements OnInit {
  isSaving = false;
  annotationElement: IAnnotationElement | null = null;

  annotationsSharedCollection: IAnnotation[] = [];

  protected annotationElementService = inject(AnnotationElementService);
  protected annotationElementFormService = inject(AnnotationElementFormService);
  protected annotationService = inject(AnnotationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AnnotationElementFormGroup = this.annotationElementFormService.createAnnotationElementFormGroup();

  compareAnnotation = (o1: IAnnotation | null, o2: IAnnotation | null): boolean => this.annotationService.compareAnnotation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ annotationElement }) => {
      this.annotationElement = annotationElement;
      if (annotationElement) {
        this.updateForm(annotationElement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const annotationElement = this.annotationElementFormService.getAnnotationElement(this.editForm);
    if (annotationElement.id !== null) {
      this.subscribeToSaveResponse(this.annotationElementService.update(annotationElement));
    } else {
      this.subscribeToSaveResponse(this.annotationElementService.create(annotationElement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnnotationElement>>): void {
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

  protected updateForm(annotationElement: IAnnotationElement): void {
    this.annotationElement = annotationElement;
    this.annotationElementFormService.resetForm(this.editForm, annotationElement);

    this.annotationsSharedCollection = this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(
      this.annotationsSharedCollection,
      annotationElement.annotation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.annotationService
      .query()
      .pipe(map((res: HttpResponse<IAnnotation[]>) => res.body ?? []))
      .pipe(
        map((annotations: IAnnotation[]) =>
          this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(annotations, this.annotationElement?.annotation),
        ),
      )
      .subscribe((annotations: IAnnotation[]) => (this.annotationsSharedCollection = annotations));
  }
}
