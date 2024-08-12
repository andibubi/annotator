import { Component, ElementRef, Input } from '@angular/core';
import { NgCompInputs } from 'gridstack/dist/angular';
import { BaseWidget } from 'gridstack/dist/angular';
import { GridStackNode } from 'gridstack';
@Component({
  selector: 'widget-textout',
  standalone: true,
  template: '{{ text }}',
})
export class TextoutComponent extends BaseWidget {
  constructor(protected elementRef: ElementRef) {
    super();
  }
  @Input() text: string = '';
  public serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }
}
