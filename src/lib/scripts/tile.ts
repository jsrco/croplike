interface TileOptions {
    fillStyle: string,
    size: number,
    strokeStyle: string
    x: number,
    y: number,
}
export class Tile {
    #ctx: CanvasRenderingContext2D
    #tileOptions: TileOptions
    constructor(ctx: CanvasRenderingContext2D, tileOptions: TileOptions) {
        this.#ctx = ctx
        this.#tileOptions = tileOptions
    }
    draw(): void {
        this.#ctx.moveTo(this.#tileOptions.x, this.#tileOptions.y);
        this.#ctx.rect(this.#tileOptions.x, this.#tileOptions.y, this.#tileOptions.size, this.#tileOptions.size);
        this.#ctx.fillStyle = this.#tileOptions.fillStyle
        this.#ctx.fill();
    }

}