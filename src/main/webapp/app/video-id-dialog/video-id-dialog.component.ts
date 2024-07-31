import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-video-id-dialog',
  standalone: true,
  templateUrl: './video-id-dialog.component.html',
  styleUrls: ['./video-id-dialog.component.scss'],
})
export class VideoIdDialogComponent {
  constructor(private http: HttpClient) {}

  invalidVideoId: boolean = false;
  videoId: string = '';
  @Output() validVideoIdEntered = new EventEmitter<string>();

  validateVideoIdPattern() {
    const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
    this.invalidVideoId = this.videoId !== '' && !videoIdPattern.test(this.videoId);
  }

  videoIdEntered() {
    const url = `/api/check-youtube-video?videoId=${this.videoId}`;

    this.http.get(url).subscribe((response: any) => {
      this.invalidVideoId = !response.items || response.items.length == 0;
      if (!this.invalidVideoId) {
        this.validVideoIdEntered.emit(this.videoId);
      }
    });
  }
}
