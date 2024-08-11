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
import { /*GridstackComponent, */ BaseWidget, NgCompInputs } from 'gridstack/dist/angular';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-yt-player',
  standalone: true,
  template: `<div [id]="'youtube-player_' + name"></div>`,
  styleUrls: ['./yt-player.component.scss'],
})
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  youtubePlayer: any;

  @Input() name: string = '';
  @Input() videoId: string = '';
  public override serialize(): NgCompInputs | undefined {
    return this.videoId ? { videoId: this.videoId } : undefined;
  }

  constructor(private ngZone: NgZone) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }

  ngOnInit() {
    if (!(window as any).YT) {
      this.loadYoutubeAPI();
    } else {
      this.initYoutubePlayer();
    }
  }

  loadYoutubeAPI() {
    if (!document.getElementById('script_' + this.name) && !(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'script_' + this.name;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);
    }

    (window as any).onYouTubeIframeAPIReady = (() => {
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      return () => {
        if (typeof previousCallback === 'function') {
          previousCallback();
        }
        this.initYoutubePlayer();
      };
    })();
  }

  initYoutubePlayer() {
    this.youtubePlayer = new (window as any).YT.Player('youtube-player_' + this.name, {
      height: '100%',
      width: '100%',
      videoId: this.videoId,
      events: {
        onReady: this.onYoutubePlayerReady.bind(this),
      },
    });
  }

  onYoutubePlayerReady(event: any) {
    setInterval(() => {
      this.ngZone.run(() => {
        this.updateAnnotations(this.youtubePlayer.getCurrentTime());
      });
    }, 1000);
  }

  updateAnnotations(actSec: number) {}
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
