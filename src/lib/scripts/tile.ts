import type { TileOptions } from '$lib/scripts/interfaces/index'
export class Tile {
    #tileOptions: TileOptions
    constructor(tileOptions: TileOptions) {
        this.#tileOptions = tileOptions
    }
    getTileOptions(): TileOptions {
        return this.#tileOptions
    }
    setTileOptions(tileOptions: TileOptions): boolean {
        if (tileOptions) {
            this.#tileOptions = tileOptions
            return true
        } else {
            return false
        }
    }
}