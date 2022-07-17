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
    constructor(tiles, player) {
        this.tiles = tiles
        // Cache dimensions
        this.width = tiles.length
        this.height = tiles[0].length
        // create a list which will hold the entities
        this.entities = []
        // create the engine and scheduler
        this.scheduler = new Scheduler.Simple()
        this.engine = new Engine(this.scheduler)
        // add the player
        this.addEntityAtRandomPosition(player);
        // add random fungi
        for (let i = 0; i < 25; i++) {
            this.addEntityAtRandomPosition(new Entity(Templates.FungusTemplate));
        }
    }
    addEntity(entity) {
        // Make sure the entity's position is within bounds
        if (entity.x < 0 || entity.x >= this.width ||
            entity.y < 0 || entity.y >= this.height) {
            throw new Error('Adding entity out of bounds.')
        }
        // Update the entity's map
        entity.map = this
        // Add the entity to the list of entities
        this.entities.push(entity)
        // Check if this entity is an actor, and if so add
        // them to the scheduler
        if (entity.hasMixin('Actor')) {
            this.scheduler.add(entity, true)
        }
    }
    addEntityAtRandomPosition(entity) {
        const position = this.getRandomFloorPosition()
        entity.x = position.x
        entity.y = position.y
        this.addEntity(entity)
    }
    // If the tile is diggable, update it to a floor
    dig(x: number, y: number) {
        if (this.tiles[x][y].isDiggable) {
            this.tiles[x][y] = Tile.floorTile
        }
    }
    getEntityAt(x: number, y: number) {
        // Iterate through all entities searching for one with
        // matching position
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].x == x && this.entities[i].y == y) {
                return this.entities[i]
            }
        }
        return false
    }
    // Randomly generate a tile which is a floor
    getRandomFloorPosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (!this.isEmptyFloor(x, y))

        return { x, y }
    }
    // Gets the tile type
    getTile(x: number, y: number) {
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
    isEmptyFloor (x, y) {
        // Check if the tile is floor and also has no entity
        return this.tiles[x][y] == Tile.floorTile &&
               !this.getEntityAt(x, y)
    }
    removeEntity(entity: Entity) {
        // Find the entity in the list of entities if it is present
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i] == entity) {
                this.entities.splice(i, 1)
                break
            }
        }
        // If the entity is an actor, remove them from the scheduler
        if (entity.hasMixin('Actor')) {
            this.scheduler.remove(entity)
        }
    }
}