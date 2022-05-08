export class Actor {
    #ctx: CanvasRenderingContext2D;
    #dX: number;
    #dY: number;
    #size: number;
    #updateArray: Array<string>;
    #x: number;
    #y: number;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, updateArray: Array<string>) {
        this.#ctx = ctx;
        this.#dX = x;
        this.#dY = y;
        this.#size = size;
        this.#x = x;
        this.#y = y;
        this.#updateArray = updateArray;
    }
    draw(): void {
        this.#ctx.fillStyle = "white";
        this.#ctx.fillRect(this.#x, this.#y, this.#size, this.#size);
    }
    move(dX: number, dY: number): void {
        this.#dX = dX
        this.#dY = dY
        this.update()
    }
    update(): void {
        const name = "" + this.#x + this.#y + this.#dX + this.#dY
        if (this.#x !== this.#dX || this.#y !== this.#dY || !this.#updateArray.includes(name)) {
            this.#updateArray.push(name)
        } else {
            this.#updateArray.splice(this.#updateArray.indexOf(name))
            this.move(78, 78);

        }
        if (this.#dX !== this.#x) {
            (this.#dX > this.#x) ? this.#x++ : this.#x--
        }
        if (this.#dY !== this.#y) {
            (this.#dY > this.#y) ? this.#y++ : this.#y--
        }
    }
}