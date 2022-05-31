import { ColorSwatch } from "$lib/scripts/colorSwatch"
import type { MapProperties } from '$lib/scripts/interfaces/index'
import { Tile } from "./tile"

export class Map {
    #map: Array<Array<Tile>>
    #mapProperties:MapProperties
    constructor(mapProperties: MapProperties) {
        this.#map = []
        this.#mapProperties = mapProperties
        this.#builder()
    }
    #builder(): void {
        const { height, width } = this.#mapProperties
        for (let x = 0; x < width; x++) {
            this.#map.push([])
            for (let y = 0; y < height; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === width - 1 ||
                    y === height - 1
                ) {
                    this.#map[x][y] = new Tile({
                        char: "#",
                        explorable: false,
                        explored: false,
                        fillStyle: ColorSwatch.red[9],
                        lightPasses:false,
                        name:"wall",
                        strokeStyle: ColorSwatch.red[9],
                    })
                } else {
                    this.#map[x][y] = new Tile({
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
    getMapProperties(): MapProperties {
        return this.#mapProperties
    }
}



