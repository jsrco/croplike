import { Engine, Scheduler } from 'rot-js'
import type Simple from 'rot-js/lib/scheduler/simple'
import { Templates } from './entities'
import { Entity } from './entity'
import { Tile } from './tile'
export class Map {
    engine: Engine
    entities: any
    height: number
    scheduler: Simple
    tiles: any
    width: number
    constructor(tiles: string | any[], player: any) {
        this.tiles = tiles
        this.width = tiles.length
        this.height = tiles[0].length
        this.entities = []
        this.scheduler = new Scheduler.Simple()
        this.engine = new Engine(this.scheduler)
        this.addEntityAtRandomPosition(player)
        for (let i = 0; i < 25; i++) {
            this.addEntityAtRandomPosition(new Entity(Templates.FungusTemplate));
        }
    }
    addEntity(entity): void {
        if (entity.x < 0 || entity.x >= this.width ||
            entity.y < 0 || entity.y >= this.height) {
            throw new Error('Adding entity out of bounds.')
        }
        entity.map = this
        this.entities.push(entity)
        if (entity.hasMixin('Actor')) {
            this.scheduler.add(entity, true)
        }
    }
    addEntityAtRandomPosition(entity: Entity): void {
        const position = this.getRandomFloorPosition()
        entity.x = position.x
        entity.y = position.y
        this.addEntity(entity)
    }
    dig(x: number, y: number): void {
        if (this.tiles[x][y].isDiggable) {
            this.tiles[x][y] = Tile.floorTile
        }
    }
    getEntityAt(x: number, y: number): Entity | boolean {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].x == x && this.entities[i].y == y) {
                return this.entities[i]
            }
        }
        return false
    }
    getEntitiesWithinRadius(centerX: number, centerY: number, radius: number): any[] {
        const results = []
        const leftX = centerX - radius
        const rightX = centerX + radius
        const topY = centerY - radius
        const bottomY = centerY + radius
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].x >= leftX &&
                this.entities[i].x <= rightX && 
                this.entities[i].y >= topY &&
                this.entities[i].y <= bottomY) {
                results.push(this.entities[i]);
            }
        }
        return results;
    }
    getRandomFloorPosition() {
        let x: number, y: number;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (!this.isEmptyFloor(x, y))

        return { x, y }
    }
    getTile(x: number, y: number) {
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
    isEmptyFloor(x: number, y: number) {
        return this.tiles[x][y] == Tile.floorTile &&
            !this.getEntityAt(x, y)
    }
    removeEntity(entity: Entity) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i] == entity) {
                this.entities.splice(i, 1)
                break
            }
        }
        if (entity.hasMixin('Actor')) {
            this.scheduler.remove(entity)
        }
    }
}