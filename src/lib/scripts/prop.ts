import type { Position, TileOptions } from '$lib/scripts/interfaces/index'
import type { Map } from '$lib/scripts/map'
import { Tile } from "$lib/scripts/tile";
export class Prop extends Tile {
    #ctx: CanvasRenderingContext2D;
    #currentMap: Map;
    #position: Position;
    #updatedPosition: Position
    constructor(tileOptions: TileOptions , map: Map ,position: Position) {
        super(tileOptions)
        this.#currentMap = map
        this.#position = position
        this.#updatedPosition = position
    }
    // Props do not normally move. 
    // Mimic Actors for now.
    #canUpdate(position:Position): boolean{
        if (position)
            return true
    }
    updatePropPostion(position:Position): boolean {
        if (position && this.#canUpdate(position)) {
            this.#updatedPosition = position
            return true
        } else {
            return false
        }
    }
}