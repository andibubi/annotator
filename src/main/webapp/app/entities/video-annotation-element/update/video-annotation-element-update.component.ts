import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { IVideoAnnotationElement } from '../video-annotation-element.model';
import { VideoAnnotationElementService } from '../service/video-annotation-element.service';
import { VideoAnnotationElementFormService, VideoAnnotationElementFormGroup } from './video-annotation-element-form.service';

@Component({
  standalone: true,
  selector: 'jhi-video-annotation-element-update',
  templateUrl: './video-annotation-element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VideoAnnotationElementUpdateComponent implements OnInit {
  isSaving = false;
  videoAnnotationElement: IVideoAnnotationElement | null = null;

  annotationsSharedCollection: IAnnotation[] = [];

  protected videoAnnotationElementService = inject(VideoAnnotationElementService);
  protected videoAnnotationElementFormService = inject(VideoAnnotationElementFormService);
  protected annotationService = inject(AnnotationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VideoAnnotationElementFormGroup = this.videoAnnotationElementFormService.createVideoAnnotationElementFormGroup();

  compareAnnotation = (o1: IAnnotation | null, o2: IAnnotation | null): boolean => this.annotationService.compareAnnotation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ videoAnnotationElement }) => {
      this.videoAnnotationElement = videoAnnotationElement;
      if (videoAnnotationElement) {
        this.updateForm(videoAnnotationElement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const videoAnnotationElement = this.videoAnnotationElementFormService.getVideoAnnotationElement(this.editForm);
    if (videoAnnotationElement.id !== null) {
      this.subscribeToSaveResponse(this.videoAnnotationElementService.update(videoAnnotationElement));
    } else {
      this.subscribeToSaveResponse(this.videoAnnotationElementService.create(videoAnnotationElement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideoAnnotationElement>>): void {
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

  protected updateForm(videoAnnotationElement: IVideoAnnotationElement): void {
    this.videoAnnotationElement = videoAnnotationElement;
    this.videoAnnotationElementFormService.resetForm(this.editForm, videoAnnotationElement);

    this.annotationsSharedCollection = this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(
      this.annotationsSharedCollection,
      videoAnnotationElement.annotation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.annotationService
      .query()
      .pipe(map((res: HttpResponse<IAnnotation[]>) => res.body ?? []))
      .pipe(
        map((annotations: IAnnotation[]) =>
          this.annotationService.addAnnotationToCollectionIfMissing<IAnnotation>(annotations, this.videoAnnotationElement?.annotation),
        ),
      )
      .subscribe((annotations: IAnnotation[]) => (this.annotationsSharedCollection = annotations));
  }
}
