import { Component, ElementRef, Input, ChangeDetectorRef, OnInit, Renderer2 } from '@angular/core';
import { NgCompInputs } from 'gridstack/dist/angular';
import { BaseWidget } from 'gridstack/dist/angular';
import { GridStackNode } from 'gridstack';
import { PlayerService } from './player.service';
import { AdvancedGrid } from '../advanced-grid/advanced-grid';
import { AudioService } from './audio.service';
@Component({
  selector: 'widget-textout',
  standalone: true,
  template: '{{ text }}',
})
export class TextoutComponent extends BaseWidget implements OnInit {
  text: string = '';
  orgStyleDisplay = '';

  @Input() name: string = '';
  @Input() content: any = {};
  constructor(
    protected elementRef: ElementRef,
    private renderer: Renderer2,
    private playerService: PlayerService,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }
  public serialize(): NgCompInputs | undefined {
    //return this.text ? { text: this.text } : undefined;
    debugger;
    // TODO
    return undefined;
  }

  ngOnInit(): void {
    this.playerService.registerTextout(this.name, this);
  }

  // TODO ineffizient und doof, siehe yt-player
  prevSecs: any = null;
  floating = false;
  public update(secs: number) {
    let replayStartSecs = this.prevSecs && this.prevSecs < secs ? this.prevSecs : 0;
    let orgText = this.text;
    let n = this.elementRef.nativeElement;
    for (let replaySecs = replayStartSecs; replaySecs <= secs; replaySecs++)
      for (let command of this.content.commands)
        if (command.timeSec <= replaySecs && replaySecs < command.timeSec + 1) {
          this.text = command.text;
          if (!command.text && !this.floating && typeof command.x !== 'undefined') {
            this.playerService.advGrid!.makeFloating(n);
            n.parentElement.parentElement.style.left = command.x + '%';
            n.parentElement.parentElement.style.top = command.y + '%';
            n.parentElement.parentElement.style.width = command.w + '%';
            n.parentElement.parentElement.style.height = command.h + '%';
            this.floating = true;
          }
        }

    if (this.text != orgText) {
      this.audioService.playMP3('content/oops.mp3');
      this.cdr.detectChanges();
      if (!this.text && orgText) {
        let closest = n.closest('gridstack-item');
        this.orgStyleDisplay = window.getComputedStyle(closest).getPropertyValue('display');
        this.renderer.setStyle(closest, 'display', 'none');
      }
      if (this.text && !orgText) {
        this.renderer.setStyle(n.closest('gridstack-item'), 'display', this.orgStyleDisplay);
      }
    }
    this.prevSecs = secs;
  }
}
