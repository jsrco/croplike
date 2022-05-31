import type { Position, TileOptions } from '$lib/scripts/interfaces/index'
import { Tile } from '$lib/scripts/tile'
export class Actor extends Tile {
    #position: Position
    #updatedPosition: Position
    constructor(tileOptions: TileOptions, position: Position) {
        super(tileOptions)
        this.#position = position
        this.#updatedPosition = position
    }
    #canUpdate(position: Position): boolean {
        if (position)
            return true
    }
    draw(ctx: CanvasRenderingContext2D, position: Position, size: number): void {
        
            // Handle logic on animation.
            // Update the postion if updatedPosition does not match after checks have been done.
        const { x, y } = position
        const { fillStyle } = this.getTileOptions()
        ctx.moveTo(x, y);
        ctx.rect(x, y, size, size);
        ctx.fillStyle = fillStyle
        ctx.fill();
    }
    getPosition(): Position {
        return this.#position
    }
    updateActorPostion(position: Position): boolean {
        if (position && this.#canUpdate(position)) {
            this.#updatedPosition = position
            return true
        } else {
            return false
        }
    }
}