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
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  private youtubePlayer: any;

  @Input() name: string = '';
  @Input() videoId: string = '';
  @Input() commands: any[] = [];
  public override serialize(): NgCompInputs | undefined {
    return this.videoId ? { videoId: this.videoId } : undefined;
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
    this.ytPlayerService!.createPlayer(this.name, this.videoId);
    this.playerService.registerYtPlayer(this.name, this);
  }

  // TODO ineffizient und doof, siehe textout.component
  prevSecs: any = null;
  public update(secs: number) {
    let lower = this.prevSecs && this.prevSecs < secs ? this.prevSecs : 0;
    let orgVideoId = this.videoId;
    for (let replaySecs = lower; replaySecs <= secs; replaySecs++) {
      let lastCommand = null;
      for (let command of this.commands)
        if (command.timeSec <= replaySecs && replaySecs < command.timeSec + 1) {
          this.videoId = command.videoId;
          lastCommand = command;
        }
      if (this.videoId != orgVideoId) {
        this.cdr.detectChanges();
        // TODO entweder oder
        this.ytPlayerService.nameSuffix2player.get(this.name).loadVideoById(this.videoId, lastCommand.timeSec);
      }
    }
    this.prevSecs = secs;
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
