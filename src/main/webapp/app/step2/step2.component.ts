import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-step2',
  standalone: true,
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() videoId: string = '';
  subtitles = [
    { time: 0, text: 'Hallo und willkommen!' },
    { time: 5, text: 'Dies ist ein Beispieltext.' },
    { time: 10, text: 'Weitere Informationen folgen.' },
  ];
  newSubtitleText: string = '';
  showSubtitleInput: boolean = false;
  player: any;
  isDragging: boolean = false;
  initialX: number = 0;
  initialY: number = 0;
  xOffset: number = 0;
  yOffset: number = 0;

  ngOnInit() {
    if (!(window as any).YT) {
      this.loadYouTubeAPI();
    } else {
      this.initPlayer();
    }
  }

  loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };
  }

  initPlayer() {
    this.player = new (window as any).YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: this.videoId,
      events: {
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  onPlayerReady(event: any) {
    setInterval(() => {
      const currentTime = this.player.getCurrentTime();
      this.updateSubtitles(currentTime);
    }, 1000);
  }

  updateSubtitles(currentTime: number) {
    const subtitleDiv = document.getElementById('custom-subtitles');
    for (const subtitle of this.subtitles) {
      if (currentTime >= subtitle.time) {
        subtitleDiv!.innerHTML = subtitle.text;
      }
    }
  }

  startComment() {
    this.showSubtitleInput = true;
  }

  stopComment() {
    alert('Kommentar beendet!');
  }

  saveSubtitle() {
    const currentTime = this.player.getCurrentTime();
    this.subtitles.push({ time: currentTime, text: this.newSubtitleText });
    this.newSubtitleText = '';
    this.showSubtitleInput = false;
    alert('Neuer Untertitel hinzugefügt!');
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.target === document.getElementById('draggable-overlay')) {
      this.isDragging = true;
      this.initialX = event.clientX - this.xOffset;
      this.initialY = event.clientY - this.yOffset;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();

      const currentX = event.clientX - this.initialX;
      const currentY = event.clientY - this.initialY;

      this.xOffset = currentX;
      this.yOffset = currentY;

      const draggableOverlay = document.getElementById('draggable-overlay');
      this.setTranslate(this.xOffset, this.yOffset, draggableOverlay);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  setTranslate(xPos: number, yPos: number, el: HTMLElement | null) {
    if (el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
  }
}
