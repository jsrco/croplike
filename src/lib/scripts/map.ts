import type { position } from './interfaces'
import { Tile } from './tile'
export class Map {
    height: number
    tiles: any
    width: number
    constructor(tiles) {
        this.tiles = tiles
        // Cache dimensions
        this.width = tiles.length
        this.height = tiles[0].length
    }
    // If the tile is diggable, update it to a floor
    dig(x, y) {
        if (this.tiles[x][y].isDiggable) {
            this.tiles[x][y] = Tile.floorTile;
        }
    }
    // Randomly generate a tile which is a floor
    getRandomFloorPosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (this.getTile({ x, y }) != Tile.floorTile);
        return { x: x, y: y };
    }
    // Gets the tile type
    getTile(position: position): Tile {
        const { x, y } = position
        // Make sure inside bounds, if not return null
        if (
            x < 0 ||
            x >= this.width ||
            y < 0 ||
            y >= this.height
        ) {
            return Tile.nullTile
        } else {
            return this.tiles[x][y] || Tile.nullTile
        }
    }
}