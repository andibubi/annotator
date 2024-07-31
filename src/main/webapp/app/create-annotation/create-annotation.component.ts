import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Step2Component } from '../step2/step2.component';
import { VideoIdDialogComponent } from '../video-id-dialog/video-id-dialog.component';

@Component({
  selector: 'jhi-create-annotation',
  standalone: true,
  imports: [CommonModule, FormsModule, Step2Component, VideoIdDialogComponent],
  templateUrl: './create-annotation.component.html',
  styleUrl: './create-annotation.component.scss',
})
export default class CreateAnnotationComponent {
  videoId: string = '';

  constructor(private http: HttpClient) {}

  handleVideoId(videoId: string) {
    this.videoId = videoId;
  }
}
