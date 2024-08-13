import { ViewChild, Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { GridStack, GridStackNode, GridStackElement } from 'gridstack';
import { BaseWidget, NgGridStackOptions, GridstackComponent, GridstackModule } from 'gridstack/dist/angular';

@Component({
  imports: [GridstackModule],
  selector: 'adv-gridstack',
  standalone: true,
  template: `<gridstack #gridstack [options]="gridOptions">
    <div empty-content>Add items here or reload the grid</div>
  </gridstack>`,
})
export class AdvancedGrid implements AfterViewInit {
  @ViewChild('gridstack', { static: true }) gridstackElement!: any;
  private outerGrid!: GridStack;
  private timerId: any;
  protected startX = 0;
  protected startY = 0;
  private draggableElements: HTMLElement[] = [];
  private nonGridDraggingElement: HTMLElement | null = null;
  protected dragInfo = { x: 0, dx: 0, y: 0, dy: 0 };
  protected resizing = false;
  protected resizeStartWidth: number = 0;
  protected resizeStartHeight: number = 0;
  protected resizeStartX: number = 0;
  protected resizeStartY: number = 0;
  protected movementThreshold = 20;
  protected gridDraggingElement: HTMLElement | null = null;

  public gridOptions: NgGridStackOptions = {
    cellHeight: 50,
    margin: 5,
    minRow: 2, // don't collapse when empty
    acceptWidgets: true,
    children: [],
  };

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
    grid.on('dragstart', (event: any, el: HTMLElement) => {
      this.onGridDragStart(grid, event, el);
    });
    grid.on('dragstop', () => {
      this.onGridDragStop();
    });
  }
  recursiveEnableGridMove(grid: GridStack, enable: boolean) {
    grid.enableMove(enable);
    console.log(enable ? 'enable' : 'disable');
    console.log(grid);
    for (let node of grid.engine.nodes) {
      if ('subGrid' in node) {
        this.recursiveEnableGridMove(node.subGrid!, enable);
      }
    }
  }

  allWidgetsAdded() {
    this.recursiveAddEventHandlers(this.outerGrid);
  }

  public ngAfterViewInit() {
    this.outerGrid = GridStack.init(this.gridOptions, this.gridstackElement.nativeElement);
  }

  private startTimer() {
    console.log('startTimer');
    this.timerId = setTimeout(() => {
      console.log('timeout');
      this.makeFloating();
    }, 3000);
  }

  private resetTimer() {
    console.log('resetTimer');
    clearTimeout(this.timerId);
    this.startTimer();
  }

  private makeFloating() {
    const gridElement = this.gridDraggingElement!.closest('.grid-stack')! as HTMLElement & { gridstack?: any };
    const gridItemElement = this.gridDraggingElement!.closest('.grid-stack .grid-stack-item')! as HTMLElement & { gridstackNode?: any };
    gridElement.gridstack.removeWidget(gridItemElement, false, true);

    let de = gridItemElement.querySelector('.grid-stack-item-content')! as HTMLElement;
    de.style.position = 'absolute';
    de.classList.add('draggable');
    this.draggableElements.push(de);

    de.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e));
    de.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    de.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e));

    alert('floating');
    console.log('floating element');
    console.log(de);
  }
  private isDraggable(targetElement: HTMLElement) {
    const gridItemElement = targetElement.closest('.grid-stack .grid-stack-item')!;
    var q = gridItemElement.querySelector('.grid-stack-item-content')! as HTMLElement;
    for (let c of this.draggableElements) if (c == q) return true;
    return false;
  }

  private onGridDragStart(grid: any, event: Event, node: any) {
    const targetElement = event.target as HTMLElement;
    console.log('onGridDragStart targetElement:');
    console.log(targetElement);
    if (this.nonGridDraggingElement) {
      console.log('exit nonGridDragging');
      return;
    }
    if (this.isDraggable(targetElement)) {
      console.log('exiting draggable');
      return;
    }
    console.log('continue');
    this.gridDraggingElement = targetElement;
    this.startX = (event as MouseEvent).clientX;
    this.startY = (event as MouseEvent).clientY;
    this.startTimer();
  }

  private onGridDragStop() {
    console.log('onGridDragStop');
    this.gridDraggingElement = null;
    clearTimeout(this.timerId);
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    console.log('onMouseDown target');
    console.log(event.target);
    const target = event.target! as HTMLElement;
    if (!this.isDraggable(target)) {
      console.log('exit non draggable target');
      console.log(event.target);
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    this.recursiveEnableGridMove(this.outerGrid, false);
    console.error('fffffffffffffffffffffffffffffffffffffffff');
    if (target.classList.contains('resizable') && event.offsetX > target.offsetWidth - 10 && event.offsetY > target.offsetHeight - 10) {
      this.resizing = true;
      this.resizeStartWidth = target.offsetWidth;
      this.resizeStartHeight = target.offsetHeight;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
    } else {
      this.dragInfo.x = event.clientX - this.dragInfo.dx;
      this.dragInfo.y = event.clientY - this.dragInfo.dy;
      console.log('nonGridDragging = true');
      //const gridItemElement = target.closest('.grid-stack .grid-stack-item') as HTMLElement;
      //this.nonGridDraggingElement = gridItemElement;
      this.nonGridDraggingElement = target;
      console.log('draginfo.x=' + this.dragInfo.x);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    let eventTarget = event.target as HTMLElement;

    console.log('onMouseMove');
    const gridItemElement = eventTarget.closest('.grid-stack .grid-stack-item') as HTMLElement;
    if (this.gridDraggingElement == eventTarget) {
      console.log('onMouseMove timer targetElement');
      console.log(eventTarget);

      const deltaX = Math.abs(event.clientX - this.startX);
      const deltaY = Math.abs(event.clientY - this.startY);

      if (deltaX > this.movementThreshold || deltaY > this.movementThreshold) {
        this.resetTimer();
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    }

    if (!this.nonGridDraggingElement) {
      console.log('exit nonGridDraggingElement != gridItemElement');
      console.log(this.nonGridDraggingElement);
      console.log(gridItemElement);
      //if (this.nonGridDraggingElement)
      //debugger
      // sonst reissts ab, wen man schnell draggt
      return;
    }

    console.log('onMouseMove dragging');
    event.stopPropagation();
    event.preventDefault();
    if (this.resizing) {
      const newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX);
      const newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY);
      gridItemElement.style.width = `${newWidth}px`;
      gridItemElement.style.height = `${newHeight}px`;
    } else {
      this.dragInfo.dx = event.clientX - this.dragInfo.x;
      this.dragInfo.dy = event.clientY - this.dragInfo.y;
      gridItemElement.style.transform = `translate3d(${this.dragInfo.dx}px, ${this.dragInfo.dy}px, 0)`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    //if (!this.isDraggable(event.target)) return;

    console.log('onMouseUp');
    this.gridDraggingElement = null;
    this.nonGridDraggingElement = null;
    this.resizing = false;

    //this.recursiveEnableGridMove(this.outerGrid, true);
  }
}