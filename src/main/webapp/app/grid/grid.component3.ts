import { Component, Input, OnInit } from '@angular/core';
import { GridStack, GridStackWidget } from 'gridstack';

// GridItem und SubGridOptions Interfaces
interface GridItem {
  x: number;
  y: number;
  w?: number;
  h?: number;
  id?: string;
  content?: string;
  subGridOpts?: SubGridOptions;
}

interface SubGridOptions {
  cellHeight: number;
  column: number | 'auto';
  acceptWidgets: boolean;
  margin: number;
  subGridDynamic: boolean;
  children?: GridItem[];
}

// GridComponent Definition
@Component({
  selector: 'app-grid',
  template: `
    <div class="grid">
      <div
        *ngFor="let item of options.children"
        class="grid-item"
        [style.gridColumn]="item.x + 1"
        [style.gridRow]="item.y + 1"
        [style.gridColumnSpan]="item.w"
        [style.gridRowSpan]="item.h"
        (click)="handleItemClick(item)"
      >
        {{ item.content }}
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        gap: 5px;
      }
      .grid-item {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: center;
        cursor: pointer;
      }
    `,
  ],
})
export default class GridComponent implements OnInit {
  @Input() options!: { children: GridItem[] };

  ngOnInit() {
    // Initialize the grid
    let count = 0;
    this.options.children.forEach(d => {
      d.id = String(count++);
      d.content = d.id;
    });
  }

  handleItemClick(item: GridItem) {
    alert(`Grid item ${item.id} clicked!`);
  }
}

// SimpleComponent Definition
@Component({
  selector: 'app-simple',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <button (click)="handleClick()">Click me</button>
      <app-grid [options]="gridOptions"></app-grid>
    </div>
  `,
  styles: [
    `
      div {
        text-align: center;
        margin-top: 50px;
      }
      h1 {
        color: #2c3e50;
      }
      p {
        color: #34495e;
      }
      button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
      }
      .grid {
        margin-top: 20px;
      }
    `,
  ],
})
export class SimpleComponent {
  title = 'Hello, Angular!';
  description = 'This is a simple Angular component with a grid.';

  gridOptions: { children: GridItem[] } = {
    children: [
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 1, w: 1, h: 1 },
    ],
  };

  handleClick() {
    alert('Button clicked!');
  }
}

// SubGridOptions mit korrigierten Typen
let subOptions: SubGridOptions = {
  cellHeight: 50,
  column: 'auto', // sollte 'auto' oder eine Zahl sein
  acceptWidgets: true,
  margin: 5,
  subGridDynamic: true,
};
