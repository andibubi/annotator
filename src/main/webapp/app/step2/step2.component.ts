import { Component, OnInit, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-step2',
  standalone: true,
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() videoId: string = '';

  textAnnotations = [
    { timeSec: 0, text: 'Hallo und willkommen!' },
    { timeSec: 5, text: 'Dies ist ein Beispieltext.' },
    { timeSec: 10, text: 'Weitere Informationen folgen.' },
  ];
  actTextAnnotation: any = undefined;
  newTextAnnotationText: string = '';
  showTextAnnotationTextInput: boolean = false;
  isFullscreen: boolean = false;

  videoAnnotations = [{ timeSec: 0, videoId: 'nqRtzQOf0Xk', videoTimeSec: 10 }];

  youtubePlayer: any;
  annotationYoutubePlayer: any;

  draggedElement: HTMLElement | null = null;
  dragInfos: Map<HTMLElement, any> = new Map();

  resizingElement: HTMLElement | null = null;
  resizeStartWidth: number = 0;
  resizeStartHeight: number = 0;
  resizeStartX: number = 0;
  resizeStartY: number = 0;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

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
      videoId: this.videoId,
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
      const currentTimeSec = this.youtubePlayer.getCurrentTime();
      this.updateTextAnnotations(currentTimeSec);
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
    const currentTimeSec = this.youtubePlayer.getCurrentTime();
    this.textAnnotations.push({ timeSec: currentTimeSec, text: this.newTextAnnotationText });
    this.newTextAnnotationText = '';
    this.showTextAnnotationTextInput = false;
  }

  updateTextAnnotations(currentTimeSec: number) {
    var nearestTextAnnotation = undefined;
    for (const textAnnotation of this.textAnnotations) {
      if (textAnnotation.timeSec <= currentTimeSec && (!nearestTextAnnotation || nearestTextAnnotation.timeSec < textAnnotation.timeSec)) {
        nearestTextAnnotation = textAnnotation;
      }
    }
    if (nearestTextAnnotation && nearestTextAnnotation != this.actTextAnnotation) {
      document.getElementById('text-annotations')!.innerHTML = nearestTextAnnotation.text;
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
