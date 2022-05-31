import { ColorSwatch } from "$lib/scripts/colorSwatch"
import type { Position } from "./interfaces/index"
import type { Actor } from "./actor"
import type { Map } from "./map"
import type { Tile } from "./tile"

export class Screen {
    #ctx: CanvasRenderingContext2D
    #map: Map
    #player: Actor
    #screenHeight: number
    #screenWidth: number
    constructor(ctx: CanvasRenderingContext2D, map: Map, player: Actor) {
        this.#ctx, 
        this.#map = map
        this.#player = player
        this.#setScreenSize
    }
    #getScreenOffsets(): Position {
        const { x,y } = this.#player.getPosition()
        // this is where you calculate the player position is closer to the edge of the map than the screen size
        // draw square at center, see how many more squares can be drawn to the edges of the screen
        // add buffer rows while moving
        return {x:x,y:y}
    }
    #setScreenSize():void{
        //setScreenSize
        this.#screenHeight = window.innerHeight
        this.#screenWidth = window.innerWidth
    }
    draw(ctx: CanvasRenderingContext2D, position: Position, size: number): void {
        // get offset postion
        // draw mapOffSet to screen at proper postion
    }
}