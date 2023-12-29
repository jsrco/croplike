import { Engine, FOV, Scheduler } from 'rot-js'
import type { Entity } from './entity'
import { EntityMixins } from './entityMixins'
import { Tile } from './tile'
export class Map {
    depth: number
    engine: Engine
    entities: any
    explored: any[]
    fov: any
    height: number
    items: any
    player: any
    scheduler: any
    tiles: any
    width: number
    constructor(tiles: string | any[]) {
        this.tiles = tiles
        this.depth = tiles.length
        this.width = tiles[0].length
        this.height = tiles[0][0].length
        this.fov = []
        this.setupFov()
        this.entities = {}
        this.items = {}
        this.scheduler = new Scheduler.Speed()
        this.engine = new Engine(this.scheduler)
        this.explored = new Array(this.depth)
        this.setupExploredArray()
    }
    addEntity(entity: Entity) {
        entity.map = this
        this.updateEntityPosition(entity)
        if (entity.hasMixin('Actor')) {
            this.scheduler.add(entity, true)
        }
        if (entity.hasMixin(EntityMixins.PlayerActor)) {
            this.player = entity
        }
    }
    addEntityAtRandomPosition(entity: Entity, z: number) {
        const position = this.getRandomFloorPosition(z)
        entity.x = position.x
        entity.y = position.y
        entity.z = position.z
        this.addEntity(entity)
    }
    addItem(x: number, y: number, z: number, item: any): void {
        const key = x + ',' + y + ',' + z
        if (this.items[key]) {
            this.items[key].push(item)
        } else {
            this.items[key] = [item]
        }
    }
    addItemAtRandomPosition(item: any, z: number): void {
        const position = this.getRandomFloorPosition(z)
        this.addItem(position.x, position.y, position.z, item)
    }
    dig(x: number, y: number, z: number): void {
        if (this.getTile(x, y, z).isDiggable) {
            this.tiles[z][x][y] = Tile.floorTile
        }
    }
    getEntityAt(x: number, y: number, z: number) {
        return this.entities[x + ',' + y + ',' + z]
    }
    getEntitiesWithinRadius(centerX: number, centerY: number,
        centerZ: number, radius: number) {
        const results = []
        const leftX = centerX - radius
        const rightX = centerX + radius
        const topY = centerY - radius
        const bottomY = centerY + radius
        for (const key in this.entities) {
            const entity = this.entities[key]
            if (entity.x >= leftX && entity.x <= rightX &&
                entity.y >= topY && entity.y <= bottomY &&
                entity.z == centerZ) {
                results.push(entity)
            }
        }
        return results
    }
    getItemsAt(x, y, z) {
        return this.items[x + ',' + y + ',' + z]
    }
    getRandomFloorPosition(z: any) {
        let x: number, y: number
        do {
            x = Math.floor(Math.random() * this.width)
            y = Math.floor(Math.random() * this.height)
        } while (!this.isEmptyFloor(x, y, z))
        return { x: x, y: y, z: z }
    }
    getTile(x: number, y: number, z: number) {
        if (
            x < 0 ||
            x >= this.width ||
            y < 0 ||
            y >= this.height ||
            z < 0 || z >= this.depth
        ) {
            return Tile.nullTile
        } else {
            return this.tiles[z][x][y] || Tile.nullTile
        }
    }
    isEmptyFloor(x: number, y: number, z: number) {
        return this.getTile(x, y, z) == Tile.floorTile &&
            !this.getEntityAt(x, y, z)
    }
    isExplored(x: number, y: number, z: number) {
        if (this.getTile(x, y, z) !== Tile.nullTile) {
            return this.explored[z][x][y]
        } else {
            return false
        }
    }
    removeEntity(entity: Entity) {
        const key = entity.x + ',' + entity.y + ',' + entity.z
        if (this.entities[key] == entity) {
            delete this.entities[key]
        }
        if (entity.hasMixin('Actor')) {
            this.scheduler.remove(entity)
        }
        if (entity.hasMixin(EntityMixins.PlayerActor)) {
            this.player = undefined
        }
    }
    setExplored(x: number, y: number, z: number, state: any): void {
        if (this.getTile(x, y, z) !== Tile.nullTile) {
            this.explored[z][x][y] = state
        }
    }
    setupExploredArray(): void {
        for (let z = 0; z < this.depth; z++) {
            this.explored[z] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                this.explored[z][x] = new Array(this.height)
                for (let y = 0; y < this.height; y++) {
                    this.explored[z][x][y] = false
                }
            }
        }
    }
    setupFov(): void {
        for (let z = 0; z < this.depth; z++) {
            const depth = z
            this.fov.push(
                new FOV.RecursiveShadowcasting((x, y) => {
                    return this.getTile(x, y, depth).lightPasses
                }))
        }
    }
    setItemsAt(x: number, y: number, z: number, items: any): void {
        const key = x + ',' + y + ',' + z
        if (items.length === 0) {
            if (this.items[key]) {
                delete this.items[key]
            }
        } else {
            this.items[key] = items
        }
    }
    updateEntityPosition(entity, oldX?, oldY?, oldZ?) {
        // Don't check using a falsy, clone situations
        if (typeof oldX === "number") {
            const oldKey = oldX + ',' + oldY + ',' + oldZ
            if (this.entities[oldKey] == entity) {
                delete this.entities[oldKey]
            }
        }
        // Make sure the entity's position is within bounds
        if (entity.x < 0 || entity.x >= this.width ||
            entity.y < 0 || entity.y >= this.height ||
            entity.z < 0 || entity.z >= this.depth) {
            throw new Error("Entity position is out of bounds.")
        }
        // Sanity check to make sure there is no entity at the new position.
        const key = entity.x + ',' + entity.y + ',' + entity.z
        if (this.entities[key]) {
            throw new Error('Tried to add an entity at an occupied position.')
        }
        // Add the entity to the table of entities
        this.entities[key] = entity
    }
}