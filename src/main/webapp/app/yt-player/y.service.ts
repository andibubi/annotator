import { Injectable } from '@angular/core';

const URL_PATTERN = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const FULL_PATTERN = new RegExp(`${VIDEO_ID_PATTERN.source}|${URL_PATTERN.source}`);
const VIDEO_ID_EXTRACT_PATTERNS = [/[?&]v=([^&]+)/, /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/];

@Injectable({ providedIn: 'root' })
export class YService {
  getVideoId(videoIdOrUrl: string): string | null {
    const isUrl = URL_PATTERN.test(videoIdOrUrl);
    if (isUrl) return this.extractVideoId(videoIdOrUrl);
    else return VIDEO_ID_PATTERN.test(videoIdOrUrl) ? videoIdOrUrl : null;
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
}
