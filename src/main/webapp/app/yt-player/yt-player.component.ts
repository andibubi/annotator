import { Component, ElementRef, OnInit, AfterViewInit, Input, NgZone, ChangeDetectorRef } from '@angular/core';
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
  template: `<div>&nbsp;</div>
    <div [id]="'youtube-player_' + name"><div>hallo</div></div>`,
  styleUrls: ['./yt-player.component.scss'],
})
// TODO CodeDups in TextoutComponent
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  videoId: string = '';
  private youtubePlayer: any;
  @Input() name: string = '';
  @Input() content: any = {};
  public override serialize(): NgCompInputs | undefined {
    //return this.videoId ? { videoId: this.videoId } : undefined;
    debugger;
    // TODO
    return undefined;
  }

  constructor(
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
    this.ytPlayerService!.createPlayer(this.name, this.content.videoId);
    this.playerService.registerYtPlayer(this.name, this);
  }

  // TODO ineffizient und doof, siehe textout.component
  prevSecs: any = null;

  floating = false;
  public update(secs: number) {
    let replayStartSecs = this.prevSecs && this.prevSecs < secs ? this.prevSecs : 0;
    let orgVideoId = this.videoId;
    let videoStartSec = 0;
    for (let replaySecs = replayStartSecs; replaySecs <= secs; replaySecs++)
      for (let command of this.content.commands)
        if (command.timeSec <= replaySecs && replaySecs < command.timeSec + 1)
          if (command.videoId) {
            this.videoId = command.videoId;
            videoStartSec = secs - command.timeSec;
          } else if (!this.floating) {
            let n = this.elementRef.nativeElement;
            this.playerService.advGrid!.makeFloating(n);
            n.parentElement.parentElement.style.left = command.x + '%';
            n.parentElement.parentElement.style.top = command.y + '%';
            n.parentElement.parentElement.style.width = command.w + '%';
            n.parentElement.parentElement.style.height = command.h + '%';
            this.floating = true;
          }

    if (this.videoId != orgVideoId) {
      this.cdr.detectChanges();
      // TODO entweder oder
      this.ytPlayerService.nameSuffix2player.get(this.name).loadVideoById(this.videoId, videoStartSec);
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
