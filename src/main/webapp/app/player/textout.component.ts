import { Component, ElementRef, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgCompInputs } from 'gridstack/dist/angular';
import { BaseWidget } from 'gridstack/dist/angular';
import { GridStackNode } from 'gridstack';
import { PlayerService } from './player.service';
import { AdvancedGrid } from '../advanced-grid/advanced-grid';
@Component({
  selector: 'widget-textout',
  standalone: true,
  template: '{{ text }}',
})
export class TextoutComponent extends BaseWidget implements OnInit {
  text: string = '';
  @Input() name: string = '';
  @Input() content: any = {};
  constructor(
    protected elementRef: ElementRef,
    private playerService: PlayerService,
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
    for (let replaySecs = replayStartSecs; replaySecs <= secs; replaySecs++)
      for (let command of this.content.commands)
        if (command.timeSec <= replaySecs && replaySecs < command.timeSec + 1)
          if (command.text) this.text = command.text;
          else if (!this.floating) {
            let n = this.elementRef.nativeElement;
            this.playerService.advGrid!.makeFloating(n);
            n.parentElement.parentElement.style.left = command.x + '%';
            n.parentElement.parentElement.style.top = command.y + '%';
            n.parentElement.parentElement.style.width = command.w + '%';
            n.parentElement.parentElement.style.height = command.h + '%';
            this.floating = true;
          }
    if (this.text != orgText) this.cdr.detectChanges();
    this.prevSecs = secs;
  }
}
