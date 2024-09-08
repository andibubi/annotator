import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { YService } from '../yt-player/y.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-video-id-dialog',
  standalone: true,
  templateUrl: './video-id-dialog.component.html',
  styleUrls: ['./video-id-dialog.component.scss'],
})
export class VideoIdDialogComponent {
  constructor(
    private yService: YService,
    private http: HttpClient,
  ) {}

  invalidVideoIdOrUrl: boolean = false;
  videoId: string = '';
  videoIdOrUrl: string = '';
  @Output() validVideoIdEntered = new EventEmitter<string>();

  validateVideoIdOrUrlPattern() {
    const videoId = this.yService.getVideoId(this.videoIdOrUrl);
    this.invalidVideoIdOrUrl = !videoId;
    if (!this.invalidVideoIdOrUrl) {
      this.videoId = videoId!;
    }
  }

  videoIdOrUrlEntered() {
    const url = `/api/check-youtube-video?videoId=${this.videoId}`;

    this.http.get(url).subscribe((response: any) => {
      this.invalidVideoIdOrUrl = !response.items || response.items.length == 0;
      if (!this.invalidVideoIdOrUrl) {
        this.validVideoIdEntered.emit(this.videoId);
      }
    });
  }
}
