import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { ITextAnnotationElement } from '../text-annotation-element.model';
import { TextAnnotationElementService } from '../service/text-annotation-element.service';
import { TextAnnotationElementFormService, TextAnnotationElementFormGroup } from './text-annotation-element-form.service';

@Component({
  standalone: true,
  selector: 'jhi-text-annotation-element-update',
  templateUrl: './text-annotation-element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TextAnnotationElementUpdateComponent implements OnInit {
  isSaving = false;
  textAnnotationElement: ITextAnnotationElement | null = null;

  annotationsSharedCollection: IAnnotation[] = [];

  protected textAnnotationElementService = inject(TextAnnotationElementService);
  protected textAnnotationElementFormService = inject(TextAnnotationElementFormService);
  protected annotationService = inject(AnnotationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TextAnnotationElementFormGroup = this.textAnnotationElementFormService.createTextAnnotationElementFormGroup();

  compareAnnotation = (o1: IAnnotation | null, o2: IAnnotation | null): boolean => this.annotationService.compareAnnotation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ textAnnotationElement }) => {
      this.textAnnotationElement = textAnnotationElement;
      if (textAnnotationElement) {
        this.updateForm(textAnnotationElement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const textAnnotationElement = this.textAnnotationElementFormService.getTextAnnotationElement(this.editForm);
    if (textAnnotationElement.id !== null) {
      this.subscribeToSaveResponse(this.textAnnotationElementService.update(textAnnotationElement));
    } else {
      this.subscribeToSaveResponse(this.textAnnotationElementService.create(textAnnotationElement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITextAnnotationElement>>): void {
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

  protected updateForm(textAnnotationElement: ITextAnnotationElement): void {
    this.textAnnotationElement = textAnnotationElement;
    this.textAnnotationElementFormService.resetForm(this.editForm, textAnnotationElement);

    this.annotationsSharedCollection = this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(
      this.annotationsSharedCollection,
      textAnnotationElement.annotation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.annotationService
      .query()
      .pipe(map((res: HttpResponse<IAnnotation[]>) => res.body ?? []))
      .pipe(
        map((annotations: IAnnotation[]) =>
          this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(annotations, this.textAnnotationElement?.annotation),
        ),
      )
      .subscribe((annotations: IAnnotation[]) => (this.annotationsSharedCollection = annotations));
  }
}
