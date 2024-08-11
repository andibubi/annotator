import { Component, OnInit, HostListener, Input, ElementRef, Renderer2, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IAnnotation } from '../entities/annotation/annotation.model';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IVideoAnnotationElement } from '../entities/video-annotation-element/video-annotation-element.model';
import { IAnnotationWithElements } from './annotation-with-elements.model';
import { PlayerService } from './player.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { GridStack, GridStackOptions } from 'gridstack';
import {
  GridstackModule,
  NgGridStackOptions,
  GridstackComponent,
  gsCreateNgComponents,
  NgGridStackWidget,
  nodesCB,
  BaseWidget,
} from 'gridstack/dist/angular';

import { AComponent, BComponent, CComponent } from './dummy.component';
import YtPlayerComponent from '../yt-player/yt-player.component';
import { TextoutComponent } from './textout.component';

// Neues Interface, das das Original erweitert
export interface NgGridStackWidgetWithGrid extends NgGridStackWidget {
  grid?: any; // Typ des Grids anpassen, wenn bekannt
}

@Component({
  imports: [CommonModule, GridstackModule, YtPlayerComponent],
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './gridstack.scss', './demo.scss', 'gridstack-extra.scss'],
  encapsulation: ViewEncapsulation.None,
})
export default class PlayerComponent implements OnInit {
  annotation: IAnnotation | null = null;

  textAnnotations = new Array<ITextAnnotationElement>();
  actTextAnnotation: any = undefined;

  videoAnnotations = new Array<IVideoAnnotationElement>();
  actVideoAnnotation: any = undefined;

  isFullscreen: boolean = false;

  youtubePlayer: any;
  annotationYoutubePlayer: any;

  draggingElement: HTMLElement | null = null;
  dragInfos: Map<HTMLElement, any> = new Map();

  resizingElement: HTMLElement | null = null;
  resizeStartWidth: number = 0;
  resizeStartHeight: number = 0;
  resizeStartX: number = 0;
  resizeStartY: number = 0;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private ngZone: NgZone,
  ) {
    GridstackComponent.addComponentToSelectorType([TextoutComponent, YtPlayerComponent, AComponent, BComponent, CComponent]);
  }

  @ViewChild('gridstack', { static: true }) gridstack!: ElementRef;

  ngOnInit() {
    if (!(window as any).YT) {
      this.loadYoutubeAPI();
    } else {
      this.initYoutubePlayers();
    }
    this.route.paramMap.subscribe(params => {
      this.playerService.findLayout(Number(params.get('layoutId'))).subscribe(
        response => {
          let sub1: NgGridStackWidgetWithGrid[] = [
            { x: 0, y: 0, h: 2, selector: 'app-yt-player', input: { name: 'sec', videoId: '7I0tBlfcg10' } },

            { x: 1, y: 1, w: 12, h: 8, selector: `app-yt-player`, input: { name: 'horst', videoId: 'NsUWXo8M7UA' } },
            { x: 1, y: 2, selector: 'widget-textout', input: { text: 'bar17' } }, // Kommentar
          ];

          let sub2: NgGridStackWidgetWithGrid[] = [
            { x: 0, y: 0 },
            { x: 0, y: 1, w: 2 },
          ];
          let subOptions: NgGridStackOptions = {
            cellHeight: 50, // should be 50 - top/bottom
            column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
            acceptWidgets: true, // will accept .grid-stack-item by default
            margin: 5,
          };
          let widgets: NgGridStackWidgetWithGrid[] = [
            { x: 0, y: 0, w: 1, h: 1, content: 'Hallo' },
            { x: 1, y: 0, w: 10, h: 11, subGridOpts: { children: sub1, class: 'sub1', ...subOptions } },
            { x: 11, y: 0, w: 1, h: 2, subGridOpts: { children: sub2, class: 'sub2', ...subOptions } },
          ];
          // give them content and unique id to make sure we track them during changes below...
          let ids = 0;
          [...widgets, ...sub1, ...sub2].forEach((w: NgGridStackWidget) => {
            if (!w.selector && !w.content && !w.subGridOpts) w.content = `item ${ids}`;
            w.id = String(ids++);
          });
          const grid = GridStack.init(this.gridOptions, this.gridstack.nativeElement);
          for (var widget of widgets) {
            widget.grid = grid;
            grid.addWidget(widget);
          }
        },
        error => {
          console.error('Error', error);
        },
      );
    });
  }

  public gridOptions: NgGridStackOptions = {
    float: true,
    cellHeight: 50,
    margin: 5,
    minRow: 2, // don't collapse when empty
    acceptWidgets: true,
    children: [],
  };

  setFullscreen(fullscreen: boolean) {
    this.isFullscreen = fullscreen;
  }

  loadYoutubeAPI() {
    console.log('player.loadToutubeApi');
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      this.initYoutubePlayers();
    };
  }

  initYoutubePlayers() {
    this.youtubePlayer = new (window as any).YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      //videoId: this.annotation!.videoId,
      events: {
        onReady: this.onYoutubePlayerReady.bind(this),
      },
    });

    this.annotationYoutubePlayer = new (window as any).YT.Player('annotation-youtube-player', {
      height: '10%',
      width: '100%',
      //videoId: 'nqRtzQOf0Xk',
      events: {
        onReady: this.onAnnotationYoutubePlayerReady.bind(this),
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

  onAnnotationYoutubePlayerReady(event: any) {
    setInterval(() => {}, 1000);
  }

  updateAnnotations(actSec: number) {
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
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLElement && target.classList.contains('draggable')) {
      event.preventDefault();
      if (target.classList.contains('resizable') && event.offsetX > target.offsetWidth - 10 && event.offsetY > target.offsetHeight - 10) {
        this.resizingElement = target;
        this.resizeStartWidth = target.offsetWidth;
        this.resizeStartHeight = target.offsetHeight;
        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;
      } else {
        var dragInfo = this.dragInfos.get(target);
        if (!dragInfo) {
          dragInfo = { x: 0, dx: 0, y: 0, dy: 0 };
          this.dragInfos.set(target, dragInfo);
        }
        dragInfo.x = event.clientX - dragInfo.dx;
        dragInfo.y = event.clientY - dragInfo.dy;
        this.draggingElement = target;
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizingElement) {
      event.preventDefault();
      const newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX);
      const newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY);
      this.resizingElement.style.width = `${newWidth}px`;
      this.resizingElement.style.height = `${newHeight}px`;
    } else if (this.draggingElement) {
      event.preventDefault();
      var dragInfo = this.dragInfos.get(this.draggingElement);

      dragInfo.dx = event.clientX - dragInfo.x;
      dragInfo.dy = event.clientY - dragInfo.y;

      this.draggingElement.style.transform = `translate3d(${dragInfo.dx}px, ${dragInfo.dy}px, 0)`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.draggingElement = null;
    if (this.resizingElement) {
      if (this.resizingElement.id === 'video-overlay') this.resizeYoutubePlayer();
      this.resizingElement = null;
    }
  }
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
}
