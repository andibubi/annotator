// grid.component.ts
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack'; // Import necessary types
import { ActivatedRoute } from '@angular/router';
import { GridService } from './grid.service';
import { GridstackModule } from 'gridstack/dist/angular';

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

interface MainGridOptions {
  cellHeight: number;
  margin: number;
  minRow: number;
  acceptWidgets: boolean;
  subGridOpts: SubGridOptions;
  subGridDynamic: boolean;
  children: GridItem[];
}

@Component({
  imports: [CommonModule, GridstackModule],
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss', './demo.scss', 'gridstack-extra.scss'],
})
export default class GridComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;
  gridElements: any[] = [];
  grid: GridStack | null = null;
  gridOptions: MainGridOptions | null = null; // Define gridOptions as a class member

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let subOptions: SubGridOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
      subGridDynamic: true, // make it recursive for all future sub-grids
    };
    let main: GridItem[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];
    let sub1: GridItem[] = [{ x: 0, y: 0 }];
    let sub0: GridItem[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];

    this.gridOptions = {
      // main grid options
      cellHeight: 50,
      margin: 5,
      minRow: 2, // don't collapse when empty
      acceptWidgets: true,
      subGridOpts: subOptions,
      subGridDynamic: true, // v7 api to create sub-grids on the fly
      children: [
        ...main,
        { x: 2, y: 0, w: 2, h: 3, id: 'sub0', subGridOpts: { children: sub0, ...subOptions } },
        { x: 4, y: 0, h: 2, id: 'sub1', subGridOpts: { children: sub1, ...subOptions } },
        // {x:2, y:0, w:2, h:3, subGridOpts: {children: [...sub1, {x:0, y:1, subGridOpts: subOptions}], ...subOptions}/*,content: "<div>nested grid here</div>"*/},
      ],
    };

    let count = 0;
    // create unique ids+content so we can incrementally load() and not re-create anything (updates)
    [...main, ...sub0, ...sub1].forEach(d => (d.id = d.content = String(count++)));
    debugger;

    const gridStackOptions: GridStackOptions = {
      cellHeight: 50,
      margin: 5,
      acceptWidgets: true,
      //children: this.gridOptions.children, // Use this.gridOptions.children
    };

    // Überprüfen, ob das Element korrekt referenziert wird
    if (!this.gridContainer || !this.gridContainer.nativeElement) {
      console.error('Grid container element not found!');
      return;
    }

    // Initialisieren von GridStack
    this.grid = GridStack.init(gridStackOptions, this.gridContainer.nativeElement);

    // Überprüfen, ob GridStack korrekt initialisiert wurde
    if (!this.grid) {
      console.error('GridStack initialization failed!');
      return;
    }

    this.gridOptions.children.forEach((child: GridItem) => {
      const content = child.content || 'LEER'; // Standardinhalt setzen, falls `content` undefined oder leer ist
      const widgetElement = document.createElement('div');
      widgetElement.classList.add('grid-stack-item');
      widgetElement.innerHTML = `
    <div class="grid-stack-item-content ">${content}</div>
  `;
      widgetElement.setAttribute('gs-x', child.x.toString());
      widgetElement.setAttribute('gs-y', child.y.toString());
      widgetElement.setAttribute('gs-w', (child.w || 1).toString());
      widgetElement.setAttribute('gs-h', (child.h || 1).toString());

      this.gridContainer.nativeElement.appendChild(widgetElement);

      console.log('Adding widget element:', widgetElement);
      this.grid!.makeWidget(widgetElement);
    });

    console.log('Grid initialization complete:', this.grid);
    /*
        this.route.paramMap.subscribe(params => {
          this.gridService.getGridElementsByLayout(Number(params.get('layoutId'))).subscribe(
            response => {
              this.gridElements = response as any[];
              this.scheduleUpdates();
            },
            error => {
              console.error('Error', error);
            },
          );
        });
      */
  }

  scheduleUpdates(): void {
    this.gridElements.forEach(element => {
      setTimeout(() => {
        const widget = this.grid!.addWidget({
          x: element.x,
          y: element.y,
          w: element.width,
          h: element.height,
          content: `<div class="grid-stack-item-content">${element.content}</div>`,
        });
        console.log('Widget scheduled:', widget);
        setTimeout(() => this.grid!.removeWidget(widget), element.displayDurationMillis);
      }, element.displayAfterMillis);
    });
  }
}
