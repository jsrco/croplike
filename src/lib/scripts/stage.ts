import type { Map } from './map'
import type { StageProperties } from '$lib/scripts/interfaces/index'

export class Stage {
    #cellSize: number
    #ctx: CanvasRenderingContext2D
    #map: Map
    #pxRatio: number

    constructor(ctx: CanvasRenderingContext2D, map: Map, stageProperties: StageProperties) {
        this.#cellSize = stageProperties.size
        this.#ctx = ctx
        this.#map = map
        this.#pxRatio = window.devicePixelRatio || 1
    }  // return a set of offset values for the given grid
    #getOffsets(): {
        xOffset: number,
        yOffset: number
    } {
        this.#pxRatio = this.#pxRatio || 1;
        const w = this.#map.mapWidth * this.#map.cellSize * this.#pxRatio;
        const h = this.#map.mapHeight * this.#map.cellSize * this.#pxRatio;
        const bufferSize = this.#map.bufferSize * this.#pxRatio;
        const xMin = bufferSize * this.#pxRatio;
        const yMin = bufferSize * this.#pxRatio;
        const xMax = (w - window.innerWidth + bufferSize) * -1;
        const yMax = (h - window.innerHeight + bufferSize) * -1;
        let x = this.#map.xOffset;
        let y = this.#map.yOffset;
        // rules
        x = x > xMin ? xMin : x;
        y = y > yMin ? yMin : y;
        x = x < xMax ? xMax : x;
        y = y < yMax ? yMax : y;
        // return offset values
        return {
            xOffset: x,
            yOffset: y
        };
    }
    drawStage(): void {
        const colors = ['yellow', 'green']
        let x
        let y
        const xOffset = this.#getOffsets().xOffset
        const yOffset = this.#getOffsets().yOffset

        this.#pxRatio = window.devicePixelRatio || 1
        this.#cellSize = this.#cellSize * this.#pxRatio;

        this.#map.cells.forEach(function (cell) {
            this.#ctx.fillStyle = colors[cell.type] || 'white';
            x = cell.x * this.#cellSize + xOffset * this.#pxRatio;
            y = cell.y * this.#cellSize + yOffset * this.#pxRatio;
            this.#ctx.fillRect(x, y, this.#cellSize, this.#cellSize);
            this.#ctx.strokeStyle = 'white';
            this.#ctx.strokeRect(x, y, this.#cellSize, this.#cellSize);
        });

        if (this.#map.selectedCellIndex > -1) {
            this.#ctx.strokeStyle = 'red';
            const cell = this.#map.cells[this.#map.selectedCellIndex];
            const x = cell.x * this.#cellSize + xOffset * this.#pxRatio;
            y = cell.y * this.#cellSize + yOffset * this.#pxRatio;
            this.#ctx.strokeStyle = 'red';
            this.#ctx.strokeRect(x, y, this.#cellSize, this.#cellSize);
        }
    }
}