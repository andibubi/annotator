import { ViewChild, Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { GridStack, GridStackNode, GridStackElement } from 'gridstack';
import { BaseWidget, NgGridStackOptions, GridstackComponent, GridstackModule } from 'gridstack/dist/angular';

@Component({
  imports: [GridstackModule],
  selector: 'adv-gridstack',
  standalone: true,
  template: `<gridstack #gridstack>
    <div empty-content>Add items here or reload the grid</div>
  </gridstack>`,
})
export class AdvancedGrid implements AfterViewInit {
  @ViewChild('gridstack', { static: false }) gridstackElement!: any;
  private outerGrid!: GridStack;
  private allGrids: GridStack[] = [];
  private timerId: any;
  protected startX = 0;
  protected startY = 0;
  protected floating = false;
  protected draggableElement: HTMLElement | null = null;
  protected nonGridDragging = false;
  protected dragInfo = { x: 0, dx: 0, y: 0, dy: 0 };
  protected resizing = false;
  protected resizeStartWidth: number = 0;
  protected resizeStartHeight: number = 0;
  protected resizeStartX: number = 0;
  protected resizeStartY: number = 0;
  protected movementThreshold = 20;
  protected gridDragging = false;

  addWidget(widget: any) {
    this.outerGrid!.addWidget(widget);
  }
  recursiveAddEventHandlers(grid: GridStack) {
    this.addEvents(grid);
    for (let node of grid.engine.nodes) {
      if ('subGrid' in node) {
        this.recursiveAddEventHandlers(node.subGrid!);
      }
    }
  }
  addEvents(grid: GridStack) {
    /*
  grid.on('dragstart', (event: any, el: HTMLElement) => {
    console.log("Nested grid dragstart:");
    this.onGridDragStart(grid, event, el);
  });
*/
    grid.on('dragstart', () => alert('dfbdfb')); //(event: Event, el: HTMLElement, node: GridStackNode) => this.onDragStart(event, node));
    grid.on('dragstop', () => {
      this.onGridDragStop();
      console.log('AdvancedGrid +++2d');
    });
    console.log('GGGG:');
    console.log(grid);
    (window as any).ttt.push(grid);
  }

  allWidgetsAdded() {
    (window as any).ttt = [];
    this.recursiveAddEventHandlers(this.allGrids[0]);
    (window as any).ttt[1].on('dragstart', (event: Event, el: HTMLElement, node: GridStackNode) => this.onGridDragStart(null, event, node));
    /*
    const nestedGrids = this.gridstackElement.el.querySelectorAll('.grid-stack-item .grid-stack');
        nestedGrids.forEach((nestedGrid: HTMLElement) => {
          const gridElement = nestedGrid.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
          //const nestedGrid2 = gridElement.gridstack;
          const nestedGrid2 = nestedGrid as (HTMLElement & { gridstack?: any }).gridstack;
          nestedGrid2.on('dragstart', (event: any, el: HTMLElement) => {
            console.log("Nested grid dragstart:");
            this.onGridDragStart(nestedGrid2, event, el);
          });
          nestedGrid2.on('dragstop', () => {this.onGridDragStop(); console.log("AdvancedGrid +++2d");});
          this.allGrids.push(nestedGrid2);
        });*/
  }

  public ngAfterViewInit() {
    //const gridDomElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    //this.grid = gridDomElement.gridstack;
    this.outerGrid = GridStack.init({}, this.gridstackElement.gridstack);
    this.outerGrid!.on('dragstart', (event: any, el: HTMLElement) => {
      console.log('Outer grid dragstart:');
      this.onGridDragStart(this.outerGrid, event, el);
    });
    this.outerGrid!.on('dragstop', () => {
      this.onGridDragStop();
      console.log('AdvancedGrid +++2d');
    });
    this.allGrids.push(this.outerGrid);

    //document.addEventListener('mousedown', e => this.onMouseDown(null, e));
    //document.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(null, e));
    //document.addEventListener('mouseup', e => this.onMouseUp(null, e));
  }

  private startTimer(grid: any, node: any, target: any) {
    console.log('startTimer grid node target: ');
    console.log(grid);
    console.log(node);
    console.log(target);
    this.timerId = setTimeout(() => {
      console.log('timeout grid node target: ');
      console.log(grid);
      console.log(node);
      console.log(target);
      this.makeFloating(grid, node, target);
    }, 3000);
  }

  private resetTimer(grid: any, node: any) {
    clearTimeout(this.timerId);
    this.startTimer(grid, node, null);
  }

  private makeFloating(grid: GridStack, node: any, target: any) {
    /*
  const nativeElement = this.elementRef.nativeElement as HTMLElement;

        const gridDomElement = nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
        this.grid = gridDomElement.gridstack;

        const gridItemDomElement = nativeElement.closest('.grid-stack-item')!;
        this.grid.removeWidget(gridItemDomElement, false, true);

        this.draggableElement = gridItemDomElement.querySelector('.grid-stack-item-content')! as HTMLElement;
        let de = this.draggableElement;
        de.style.position = 'absolute';
        de.classList.add('draggable');
        de.addEventListener('mousedown', e => this.onMouseDown(e));
        de.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
        de.addEventListener('mouseup', e => this.onMouseUp(e));

        this.floating = true;
        alert('floating');
  */
    const node2 = (grid as any).abra.find((n: any) => n === node);
    debugger;
    const gridDomElement = null as any as HTMLElement & { gridstack?: any }; //nativeElement.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    let gridNNN = gridDomElement.gridstack;
    const gridItemDomElement = null as any as HTMLElement & { gridstack?: any }; //nativeElement.closest('.grid-stack-item')!;
    gridNNN.removeWidget(gridItemDomElement, false, true);

    let de = node;
    //de.style.position = 'absolute';
    //de.classList.add('draggable');
    //de.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(node, e));
    //de.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(node, e));
    //de.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(node, e));

    //this.floating = true;
    alert('floating');
  }

  private onGridDragStart(grid: any, event: Event, node: any) {
    console.log('onGridDragStart node:');
    console.log(node);
    this.gridDragging = true;
    this.startX = (event as MouseEvent).clientX;
    this.startY = (event as MouseEvent).clientY;
    const targetElement = event.target as HTMLElement;
    this.startTimer(grid, node, targetElement.closest('.grid-stack-item')!);
  }

  private onGridDragStop() {
    console.log('onGridDragStop');
    this.gridDragging = false;
    clearTimeout(this.timerId);
  }

  onMouseDown(node: any, event: MouseEvent) {
    /*
    const targetElement = event.target as HTMLElement;
    if (targetElement) {
        // Frage alle Widgets im Grid ab
            const gridItems = this.grid.getGridItems();

            // Überprüfe, ob event.target Teil eines Widgets ist
            const widgetElement = gridItems.find(widget => widget.contains(targetElement));

            console.log("$$$$$$$$$$$$$$$$$" + widgetElement);
            console.log(widgetElement);
      }
    */
    if (!this.floating || event.target != this.draggableElement) return;

    event.stopPropagation();
    event.preventDefault();
    this.allGrids.forEach((grid: GridStack) => {
      grid.enableMove(false);
    });
    //const target = this.draggableElement!;
    const target = node!;
    if (target.classList.contains('resizable') && event.offsetX > target.offsetWidth - 10 && event.offsetY > target.offsetHeight - 10) {
      this.resizing = true;
      this.resizeStartWidth = target.offsetWidth;
      this.resizeStartHeight = target.offsetHeight;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
    } else {
      this.dragInfo.x = event.clientX - this.dragInfo.dx;
      this.dragInfo.y = event.clientY - this.dragInfo.dy;
      this.nonGridDragging = true;
    }
  }

  onMouseMove(node: any, event: MouseEvent) {
    if (!this.floating && this.gridDragging) {
      const deltaX = Math.abs(event.clientX - this.startX);
      const deltaY = Math.abs(event.clientY - this.startY);

      if (deltaX > this.movementThreshold || deltaY > this.movementThreshold) {
        this.resetTimer(null, node);
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    }

    if (!this.floating || (event.target != node && !this.nonGridDragging))
      // sonst reissts ab, wen man schnell draggt
      return;

    if (this.floating) {
      if (this.resizing) {
        event.preventDefault();
        const target = node;
        const newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX);
        const newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY);
        target.style.width = `${newWidth}px`;
        target.style.height = `${newHeight}px`;
      } else if (this.nonGridDragging) {
        event.preventDefault();
        this.dragInfo.dx = event.clientX - this.dragInfo.x;
        this.dragInfo.dy = event.clientY - this.dragInfo.y;
        node!.style.transform = `translate3d(${this.dragInfo.dx}px, ${this.dragInfo.dy}px, 0)`;
      }
    }
  }

  onMouseUp(node: any, event: MouseEvent) {
    if (event.target != node) return;

    this.gridDragging = false;
    this.nonGridDragging = false;
    this.resizing = false;

    this.allGrids.forEach((grid: GridStack) => {
      grid.enableMove(false);
    });
  }
}
