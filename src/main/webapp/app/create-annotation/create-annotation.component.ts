import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Step2Component } from '../step2/step2.component';
import { VideoIdDialogComponent } from '../video-id-dialog/video-id-dialog.component';
import { AnnotationService } from '../entities/annotation/service/annotation.service';
import { IAnnotation, NewAnnotation } from '../entities/annotation/annotation.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-create-annotation',
  standalone: true,
  imports: [CommonModule, FormsModule, Step2Component, VideoIdDialogComponent],
  templateUrl: './create-annotation.component.html',
  styleUrl: './create-annotation.component.scss',
})
export default class CreateAnnotationComponent {
  annotation: IAnnotation | null = null;

  constructor(
    private http: HttpClient,
    private annotationService: AnnotationService,
  ) {}

  handleVideoId(videoId: string) {
    this.subscribeToSaveResponse(this.annotationService.create({ id: null, videoId: videoId }));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IAnnotation>>): void {
    result.subscribe(
      (res: HttpResponse<IAnnotation>) => this.onSaveSuccess(res),
      (res: HttpResponse<any>) => this.onSaveError(),
    );
  }

  private onSaveSuccess(response: HttpResponse<IAnnotation>): void {
    // Handle successful save, e.g., navigate to a list view or show a success message
    this.annotation = response.body;
    console.log('Entity successfully created', response.body);
  }

  private onSaveError(): void {
    // Handle save error, e.g., show an error message
    console.error('There was an error creating the entity');
  }
}
