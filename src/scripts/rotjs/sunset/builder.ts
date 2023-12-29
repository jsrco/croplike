import { Map } from "rot-js";
import { Tile } from "./tile";
import { getNeighborPositions, randomize } from "./utility";

export class Builder {
    depth: number
    height: number
    regions: Array<any>
    tiles: Array<any>
    width: number
    constructor(width, height, depth) {
        this.depth = depth
        this.height = height
        this.tiles = new Array(depth)
        this.regions = new Array(depth)
        this.width = width
        for (let z = 0; z < depth; z++) {
            for (let z = 0; z < depth; z++) {
                this.tiles[z] = this.generateLevel()
                this.regions[z] = new Array(width)
                for (let x = 0; x < width; x++) {
                    this.regions[z][x] = new Array(height);
                    for (let y = 0; y < height; y++) {
                        this.regions[z][x][y] = 0
                    }
                }
            }
        }
        for (let z = 0; z < this.depth; z++) {
            this.setupRegions(z)
        }
        this.connectAllRegions()
    }
    canFillRegion (x, y, z) {
        if (x < 0 || y < 0 || z < 0 || x >= this.width ||
            y >= this.height || z >= this.depth) {
            return false
        }
        if (this.regions[z][x][y] != 0) {
            return false
        }
        return this.tiles[z][x][y].isWalkable
    }
    connectAllRegions() {
        for (let z = 0; z < this.depth - 1; z++) {
            const connected = {}
            let key
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    key = this.regions[z][x][y] + ',' +
                          this.regions[z+1][x][y]
                    if (this.tiles[z][x][y] == Tile.floorTile &&
                        this.tiles[z+1][x][y] == Tile.floorTile &&
                        !connected[key]) {
                        this.connectRegions(z, this.regions[z][x][y],
                            this.regions[z+1][x][y])
                        connected[key] = true
                    }
                }
            }
        }
    }
    connectRegions(z, r1, r2) {
        const overlap = this.findRegionOverlaps(z, r1, r2)
        if (overlap.length == 0) {
            return false
        }
        const point = overlap[0]
        this.tiles[z][point.x][point.y] = Tile.stairsDownTile
        this.tiles[z+1][point.x][point.y] = Tile.stairsUpTile
        return true
    }
    fillRegion(region, x, y, z) {
        let tilesFilled = 1
        const tiles = [{x:x, y:y}]
        let tile
        let neighbors
        this.regions[z][x][y] = region
        while (tiles.length > 0) {
            tile = tiles.pop()
            neighbors = getNeighborPositions(tile.x, tile.y)
            while (neighbors.length > 0) {
                tile = neighbors.pop()
                if (this.canFillRegion(tile.x, tile.y, z)) {
                    this.regions[z][tile.x][tile.y] = region
                    tiles.push(tile)
                    tilesFilled++
                }
            }
    
        }
        return tilesFilled
    }
    findRegionOverlaps (z, r1, r2) {
        const matches = []
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.tiles[z][x][y]  == Tile.floorTile &&
                    this.tiles[z+1][x][y] == Tile.floorTile &&
                    this.regions[z][x][y] == r1 &&
                    this.regions[z+1][x][y] == r2) {
                    matches.push({x: x, y: y})
                }
            }
        }
        return randomize(matches)
    }
    generateLevel() {
        const map = new Array(this.width)
        for (let w = 0; w < this.width; w++) {
            map[w] = new Array(this.height)
        }
        const generator = new Map.Cellular(this.width, this.height)
        generator.randomize(0.5)
        const totalIterations = 3
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create()
        }
        generator.create((x, y, v) => {
            if (v === 1) {
                map[x][y] = Tile.floorTile
            } else {
                map[x][y] = Tile.wallTile
            }
        });
        return map
    }
    removeRegion (region, z) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.regions[z][x][y] == region) {
                    this.regions[z][x][y] = 0
                    this.tiles[z][x][y] = Tile.wallTile
                }
            }
        }
    }
    setupRegions(z) {
        let region = 1
        let tilesFilled
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.canFillRegion(x, y, z)) {
                    tilesFilled = this.fillRegion(region, x, y, z)
                    if (tilesFilled <= 20) {
                        this.removeRegion(region, z)
                    } else {
                        region++
                    }
                }
            }
        }
    }
}
