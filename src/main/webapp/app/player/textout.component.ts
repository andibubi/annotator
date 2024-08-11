import { Component, ElementRef, AfterViewInit, Input } from '@angular/core';
import { DraggableResizableWidget } from '../draggable-resizable-widget/draggable-resizable-widget'; // Importiere die Basisklasse
import { NgCompInputs } from 'gridstack/dist/angular';
import { GridStack } from 'gridstack';

@Component({
  selector: 'widget-textout',
  standalone: true,
  template: '{{ text }}',
})
export class TextoutComponent extends DraggableResizableWidget implements AfterViewInit {
  constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }
  @Input() text: string = '';
  public serialize(): NgCompInputs | undefined {
    return this.text ? { text: this.text } : undefined;
  }
  ngAfterViewInit() {
    this.afterViewInit();
  }
}
