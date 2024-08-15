import { Component, ElementRef, OnInit, AfterViewInit, Input, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseWidget } from 'gridstack/dist/angular';
import { NgCompInputs } from 'gridstack/dist/angular';
import { YtPlayerService } from './yt-player.service';

@Component({
  imports: [],
  selector: 'app-yt-player',
  standalone: true,
  template: `<div>&nbsp;</div>
    <div [id]="'youtube-player_' + name"><div>hallo</div></div>`,
  //template: `<div [id]="'youtube-player_' + name"></div>`,
  styleUrls: ['./yt-player.component.scss'],
})
export default class YtPlayerComponent extends BaseWidget implements OnInit {
  private youtubePlayer: any;

  @Input() name: string = '';
  @Input() videoId: string = '';
  public override serialize(): NgCompInputs | undefined {
    return this.videoId ? { videoId: this.videoId } : undefined;
  }

  //private ytPlayerService: YtPlayerService|null = null;
  private laambda: any = null;
  constructor(
    private ytPlayerService: YtPlayerService,
    protected elementRef: ElementRef,
    private ngZone: NgZone,
  ) {
    super();
    //GridstackComponent.addComponentToSelectorType([YtPlayerComponent]);
  }

  ngOnInit() {
    this.laambda = this.ytPlayerService!.createPlayer(this.name, this.videoId);
    // TODO aktivieren
    /*
      setInterval(() => {
        this.ngZone.run(() => {
          this.updateAnnotations(this.youtubePlayer.getCurrentTime());
        });
      }, 1000);*/
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
