import { Component, OnInit, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IAnnotationElement } from '../entities/annotation-element/annotation-element.model';
import { IAnnotation } from '../entities/annotation/annotation.model';
import { AnnotationElementService } from '../entities/annotation-element/service/annotation-element.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-step2',
  standalone: true,
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() annotation: IAnnotation | null = null;

  textAnnotations = new Array<IAnnotationElement>();
  actTextAnnotation: any = undefined;
  newTextAnnotationText: string = '';
  showTextAnnotationTextInput: boolean = false;
  isFullscreen: boolean = false;

  videoAnnotations = [{ startSec: 0, videoId: 'nqRtzQOf0Xk', videostartSec: 10 }];

  youtubePlayer: any;
  annotationYoutubePlayer: any;

  draggedElement: HTMLElement | null = null;
  dragInfos: Map<HTMLElement, any> = new Map();

  resizingElement: HTMLElement | null = null;
  resizeStartWidth: number = 0;
  resizeStartHeight: number = 0;
  resizeStartX: number = 0;
  resizeStartY: number = 0;

  constructor(private annotationElementService: AnnotationElementService) {}

  ngOnInit() {
    if (!(window as any).YT) {
      this.loadYoutubeAPI();
    } else {
      this.initYoutubePlayers();
    }
  }

  setFullscreen(fullscreen: boolean) {
    this.isFullscreen = fullscreen;
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
    this.youtubePlayer = new (window as any).YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: this.annotation!.videoId,
      events: {
        onReady: this.onYoutubePlayerReady.bind(this),
      },
    });

    this.annotationYoutubePlayer = new (window as any).YT.Player('annotation-youtube-player', {
      height: '10%',
      width: '100%',
      videoId: 'nqRtzQOf0Xk',
      events: {
        onReady: this.onAnnotationYoutubePlayerReady.bind(this),
      },
    });
  }

  onYoutubePlayerReady(event: any) {
    setInterval(() => {
      const currentstartSec = this.youtubePlayer.getCurrentTime();
      this.updateTextAnnotations(currentstartSec);
    }, 1000);
  }

  onAnnotationYoutubePlayerReady(event: any) {
    setInterval(() => {}, 1000);
  }

  startTextAnnotation() {
    this.showTextAnnotationTextInput = true;
  }

  stopTextAnnotation() {
    alert('Kommentar beendet!');
  }

  saveTextAnnotation() {
    this.subscribeToSaveResponse(
      this.annotationElementService.create({
        id: null,
        startSec: this.youtubePlayer.getCurrentTime(),
        text: this.newTextAnnotationText,
        annotation: this.annotation,
      }),
    );
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IAnnotationElement>>): void {
    result.subscribe(
      (res: HttpResponse<IAnnotationElement>) => this.onSaveSuccess(res),
      (res: HttpResponse<any>) => this.onSaveError(),
    );
  }

  private onSaveSuccess(response: HttpResponse<IAnnotationElement>): void {
    this.textAnnotations.push(response.body!);
    this.newTextAnnotationText = '';
    this.showTextAnnotationTextInput = false;
  }

  private onSaveError(): void {
    // Handle save error, e.g., show an error message
    console.error('There was an error creating the entity');
  }

  updateTextAnnotations(currentstartSec: number) {
    var nearestTextAnnotation = undefined;
    for (const textAnnotation of this.textAnnotations) {
      if (
        textAnnotation.startSec! <= currentstartSec &&
        (!nearestTextAnnotation || nearestTextAnnotation.startSec! < textAnnotation.startSec!)
      ) {
        nearestTextAnnotation = textAnnotation;
      }
    }
    if (nearestTextAnnotation && nearestTextAnnotation != this.actTextAnnotation) {
      document.getElementById('text-annotations')!.innerHTML = nearestTextAnnotation.text!;
      this.actTextAnnotation = nearestTextAnnotation;
    }
  }

  startVideoAnnotation() {
    //this.showTextAnnotationTextInput = true;
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
        this.draggedElement = target;
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
    } else if (this.draggedElement) {
      event.preventDefault();
      var dragInfo = this.dragInfos.get(this.draggedElement);

      dragInfo.dx = event.clientX - dragInfo.x;
      dragInfo.dy = event.clientY - dragInfo.y;

      this.draggedElement.style.transform = `translate3d(${dragInfo.dx}px, ${dragInfo.dy}px, 0)`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.draggedElement = null;
    if (this.resizingElement) {
      this.resizeYoutubePlayer();
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
