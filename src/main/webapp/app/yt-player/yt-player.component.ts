import { Component, OnInit, HostListener, Input, ElementRef, Renderer2, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IAnnotation } from '../entities/annotation/annotation.model';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IVideoAnnotationElement } from '../entities/video-annotation-element/video-annotation-element.model';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BaseWidget, NgCompInputs } from 'gridstack/dist/angular';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-yt-player',
  standalone: true,
  template: ' <div id="youtube-player"></div>',
  styleUrls: ['./yt-player.component.scss'],
})
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  youtubePlayer: any;

  @Input() videoId: string = '';
  public override serialize(): NgCompInputs | undefined {
    return this.videoId ? { videoId: this.videoId } : undefined;
  }

  constructor(private ngZone: NgZone) {
    super();
  }

  ngOnInit() {
    if (!(window as any).YT) {
      this.loadYoutubeAPI();
    } else {
      this.initYoutubePlayers();
    }
  }

  loadYoutubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      this.initYoutubePlayers();
    };
  }

  initYoutubePlayers() {
    let bbb = this;
    let ccc = bbb.videoId;
    setTimeout(() => {
      this.youtubePlayer = new (window as any).YT.Player(
        'youtube-player',
        {
          height: '100%',
          width: '100%',
          videoId: this.videoId,
          events: {
            onReady: this.onYoutubePlayerReady.bind(this),
          },
        },
        0,
      );
    });
  }

  onYoutubePlayerReady(event: any) {
    setInterval(() => {
      this.ngZone.run(() => {
        this.updateAnnotations(this.youtubePlayer.getCurrentTime());
      });
    }, 1000);
  }

  onAnnotationYoutubePlayerReady(event: any) {
    setInterval(() => {}, 1000);
  }

  updateAnnotations(actSec: number) {
    /*
    var nearestTextAnnotation = undefined;
    for (const textAnnotation of this.textAnnotations)
      if (actSec >= textAnnotation.startSec! && (!nearestTextAnnotation || nearestTextAnnotation.startSec! < textAnnotation.startSec!))
        nearestTextAnnotation = textAnnotation;

    if (nearestTextAnnotation && nearestTextAnnotation != this.actTextAnnotation) {
      document.getElementById('text-annotations')!.innerHTML = nearestTextAnnotation.text!;
      this.actTextAnnotation = nearestTextAnnotation;
    }

    var nearestVideoAnnotation = undefined;
    for (const videoAnnotation of this.videoAnnotations)
      if (actSec >= videoAnnotation.startSec! && actSec < videoAnnotation.stopSec!) nearestVideoAnnotation = videoAnnotation;

    if (nearestVideoAnnotation && nearestVideoAnnotation != this.actVideoAnnotation) {
      this.annotationYoutubePlayer.loadVideoById(nearestVideoAnnotation.videoId, nearestVideoAnnotation.videoStartSec, 'large');
      this.actVideoAnnotation = nearestVideoAnnotation;
    } else if (!nearestVideoAnnotation && this.actVideoAnnotation) {
      this.annotationYoutubePlayer.stopVideo();
      this.actVideoAnnotation = undefined;
    }
    */
  }
  /*
  resizeYoutubePlayer() {
    if (this.annotationYoutubePlayer) {
      const overlay = document.getElementById('video-overlay');
      if (overlay) {
        const newWidth = overlay.clientWidth;
        const newHeight = overlay.clientHeight;
        this.annotationYoutubePlayer.setSize(newWidth, newHeight);
      }
    }
  }
  */
}
