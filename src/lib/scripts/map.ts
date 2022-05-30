import { ColorSwatch } from "$lib/scripts/colorSwatch"
import type { MapProperties, Position } from '$lib/scripts/interfaces/index'
import { Tile } from "./tile"

export class Map {
    mapHeight: number
    mapWidth: number
    map: Array<Array<Tile>>
    constructor(mapProperties: MapProperties) {
        const { height, width } = mapProperties
        this.mapHeight = height
        this.mapWidth = width
        this.map = []
        this.#builder()
    }
    #builder(): void {
        for (let x = 0; x < this.mapWidth; x++) {
            this.map.push([])
            for (let y = 0; y < this.mapHeight; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.mapWidth - 1 ||
                    y === this.mapHeight - 1
                ) {
                    this.map[x][y] = new Tile({
                        char: "#",
                        explorable: false,
                        explored: false,
                        fillStyle: ColorSwatch.red[9],
                        lightPasses:false,
                        name:"wall",
                        strokeStyle: ColorSwatch.red[9],
                    })
                } else {
                    this.map[x][y] = new Tile({
                        char: ".",
                        explorable: true,
                        explored: false,
                        fillStyle: ColorSwatch.green[9],
                        lightPasses:true,
                        name:"ground",
                        strokeStyle: ColorSwatch.green[9],
                    })
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D, position: Position, size: number): void {
        // draw map
    }
}



