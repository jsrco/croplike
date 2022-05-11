import type { TileOptions } from '$lib/scripts/interfaces/index'
import { Tile } from "$lib/scripts/tile";
export class Actor extends Tile {
    #dX: number;
    #dY: number;
    #size: number;
    #x: number;
    #y: number;
    constructor(ctx: CanvasRenderingContext2D, tileOptions: TileOptions) {
        super(ctx,tileOptions)
        this.#dX = tileOptions.x;
        this.#dY = tileOptions.y;
    }
    move(dX: number, dY: number): void {
        this.#dX = dX
        this.#dY = dY
        this.update()
    }
    update(): void {
        if (this.#dX !== this.#x) {
            (this.#dX > this.#x) ? this.#x += 2 : this.#x -= 2
        }
        if (this.#dY !== this.#y) {
            (this.#dY > this.#y) ? this.#y += 2 : this.#y -= 2
        }
    }
}