import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

const URL_PATTERN = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const FULL_PATTERN = new RegExp(`${VIDEO_ID_PATTERN.source}|${URL_PATTERN.source}`);
const VIDEO_ID_EXTRACT_PATTERNS = [/[?&]v=([^&]+)/, /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/];

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-video-id-dialog',
  standalone: true,
  templateUrl: './video-id-dialog.component.html',
  styleUrls: ['./video-id-dialog.component.scss'],
})
export class VideoIdDialogComponent {
  constructor(private http: HttpClient) {}

  invalidVideoIdOrUrl: boolean = false;
  videoId: string = '';
  videoIdOrUrl: string = '';
  @Output() validVideoIdEntered = new EventEmitter<string>();

  validateVideoIdOrUrlPattern() {
    const isUrl = URL_PATTERN.test(this.videoIdOrUrl);
    if (isUrl) {
      const videoId = this.extractVideoId(this.videoIdOrUrl);
      this.invalidVideoIdOrUrl = !videoId;
      if (!this.invalidVideoIdOrUrl) {
        this.videoId = videoId!;
      }
    } else {
      this.invalidVideoIdOrUrl = !VIDEO_ID_PATTERN.test(this.videoIdOrUrl);
      if (!this.invalidVideoIdOrUrl) {
        this.videoId = this.videoIdOrUrl;
      }
    }
  }

  extractVideoId(url: string): string | null {
    for (const pattern of VIDEO_ID_EXTRACT_PATTERNS) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || match[2];
      }
    }
    return null;
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
