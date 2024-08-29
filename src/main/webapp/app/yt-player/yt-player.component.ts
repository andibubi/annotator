import { Component, ElementRef, OnInit, AfterViewInit, Input, NgZone, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseWidget } from 'gridstack/dist/angular';
import { NgCompInputs } from 'gridstack/dist/angular';
import { YtPlayerService } from './yt-player.service';
import { PlayerService } from '../player/player.service';

@Component({
  imports: [],
  selector: 'app-yt-player',
  standalone: true,
  template: ` <div class="not-fullscreen">&nbsp;</div>
    <div [id]="'youtube-player_' + name"></div>`,
  styleUrls: ['./yt-player.component.scss'],
})
// TODO CodeDups in TextoutComponent
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  videoId: string = '';
  orgStyleDisplay = '';

  private youtubePlayer: any;

  // Siehe PlayerService.createInput()
  @Input() name: string = '';
  @Input() content: any = {};
  public override serialize(): NgCompInputs | undefined {
    //return this.videoId ? { videoId: this.videoId } : undefined;
    debugger;
    // TODO
    return undefined;
  }

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private playerService: PlayerService,
    private ytPlayerService: YtPlayerService,
    protected elementRef: ElementRef,
    private ngZone: NgZone,
  ) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }

  ngOnInit() {
    if (this.name != 'org') this.renderer.setStyle(this.elementRef.nativeElement.closest('div'), 'z-index', '1000');
    // TODO mit in createPlayer machen
    this.playerService.registerYtPlayer(this.name, this);
    // TODO Lambda in createPlayer erzeugen
    this.ytPlayerService!.createPlayer(this.name, this.content.videoId, (event: any) =>
      this.playerService.onYtPlayerStateChange(this.name, event),
    );
    this.setVisible(this.content.videoId != null);
  }

  setVisible(visible: boolean) {
    // TODO Nicht an Angular vorbei
    this.elementRef.nativeElement.closest('.grid-stack-item')!.style.display = visible ? 'unset' : 'none';
    // TODO in sccs-File verschieben
    let s = this.elementRef.nativeElement.closest('app-yt-player').style;
    s.height = '100%';
    s.width = '100%';
  }

  // TODO ineffizient und doof, siehe textout.component
  prevSecs: any = null;

  floating = false;
  public update(secs: number) {
    let replayStartSecs = this.prevSecs && this.prevSecs < secs ? this.prevSecs : 0;
    let orgVideoId = this.videoId;
    let videoStartSec = 0;
    let n = this.elementRef.nativeElement;
    for (let replaySecs = replayStartSecs; replaySecs <= secs; replaySecs++)
      for (let command of this.content.commands)
        if (command.timeSec <= replaySecs && replaySecs < command.timeSec + 1) {
          this.videoId = command.videoId;
          videoStartSec = secs - command.timeSec;
          if (!command.videoId && !this.floating && typeof command.x !== 'undefined') {
            this.playerService.advGrid!.makeFloating(n);
            n.parentElement.parentElement.style.left = command.x + '%';
            n.parentElement.parentElement.style.top = command.y + '%';
            n.parentElement.parentElement.style.width = command.w + '%';
            n.parentElement.parentElement.style.height = command.h + '%';
            this.floating = true;
          }
        }

    if (this.videoId != orgVideoId) {
      this.cdr.detectChanges();
      if (!this.videoId && orgVideoId) {
        let closest = n.closest('gridstack-item');
        this.orgStyleDisplay = window.getComputedStyle(closest).getPropertyValue('display');
        this.renderer.setStyle(closest, 'display', 'none');
      }
      if (this.videoId && !orgVideoId) {
        this.renderer.setStyle(n.closest('gridstack-item'), 'display', this.orgStyleDisplay);
      }
      // TODO entweder oder
      if (this.videoId != null) this.ytPlayerService.nameSuffix2player.get(this.name).loadVideoById(this.videoId, videoStartSec);
    }
    this.prevSecs = secs;
  }

  public pause(pause: boolean) {
    let p = this.ytPlayerService.nameSuffix2player.get(this.name);
    if (pause) p.pauseVideo();
    else p.playVideo();
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
