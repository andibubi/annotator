import { Component, OnInit, HostListener, Input, ElementRef, Renderer2, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IVideoAnnotationElement } from '../entities/video-annotation-element/video-annotation-element.model';
import { IAnnotation } from '../entities/annotation/annotation.model';
import { TextAnnotationElementService } from '../entities/text-annotation-element/service/text-annotation-element.service';
import { VideoAnnotationElementService } from '../entities/video-annotation-element/service/video-annotation-element.service';
import { AnnotationService } from '../entities/annotation/service/annotation.service';
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

  textAnnotations = new Array<ITextAnnotationElement>();
  actTextAnnotation: any = undefined;

  showTextAnnotationDialog: boolean = false;
  newTextAnnotationText: string = '';

  videoAnnotations = new Array<IVideoAnnotationElement>();
  actVideoAnnotation: any = undefined;

  showVideoAnnotationDialog: boolean = false;
  newVideoAnnotationUrl: string = '';
  newVideoAnnotationStartSec: number = 0;
  newVideoAnnotationStopSec: number = 1000;

  qrCodeData: any = undefined;

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
    private annotationService: AnnotationService,
    private textAnnotationElementService: TextAnnotationElementService,
    private videoAnnotationElementService: VideoAnnotationElementService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    if (!(window as any).YT) {
      debugger;
      //this.loadYoutubeAPI();
    } else {
      //this.initYoutubePlayers();
    }
  }

  setFullscreen(fullscreen: boolean) {
    this.isFullscreen = fullscreen;
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

  startTextAnnotation() {
    this.youtubePlayer.pauseVideo();
    this.showTextAnnotationDialog = true;
  }

  startVideoAnnotation() {
    this.youtubePlayer.pauseVideo();
    this.showVideoAnnotationDialog = true;
  }

  showAnnotationUrl() {
    this.annotationService.getQrCode(this.annotation!.id).subscribe(
      data => {
        this.qrCodeData = data;
      },
      error => {
        console.error('Error generating QR code', error);
      },
    );
  }

  saveTextAnnotation() {
    this.textAnnotationElementService
      .create({
        id: null,
        startSec: this.youtubePlayer.getCurrentTime(),
        text: this.newTextAnnotationText,
        annotation: this.annotation,
      })
      .subscribe(
        (response: HttpResponse<ITextAnnotationElement>) => {
          this.textAnnotations.push(response.body!);
          this.newTextAnnotationText = '';
          this.showTextAnnotationDialog = false;
        },
        (res: HttpResponse<any>) => this.onSaveError(),
      );
    this.youtubePlayer.playVideo();
  }

  saveVideoAnnotation() {
    this.videoAnnotationElementService
      .create({
        id: null,
        startSec: this.youtubePlayer.getCurrentTime(),
        stopSec: this.youtubePlayer.getCurrentTime() + this.newVideoAnnotationStopSec - this.newVideoAnnotationStartSec,
        videoId: this.newVideoAnnotationUrl,
        videoStartSec: this.newVideoAnnotationStartSec,
        annotation: this.annotation,
      })
      .subscribe(
        (response: HttpResponse<IVideoAnnotationElement>) => {
          this.videoAnnotations.push(response.body!);
          //this.videoAnnotations.push({ startSec: 5, stopSec: 8, videoId: 'nqRtzQOf0Xk', videoStartSec: 100 });
          this.showVideoAnnotationDialog = false;
        },
        (res: HttpResponse<any>) => this.onSaveError(),
      );
    this.youtubePlayer.playVideo();
  }

  private onSaveError(): void {
    // Handle save error, e.g., show an error message
    console.error('There was an error creating the entity');
    alert('Da ist was schief gegangen.');
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
