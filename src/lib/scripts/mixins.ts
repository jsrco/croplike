import { Game } from "./diesel";
import { Templates } from "./entities";
import { Entity } from "./entity";

// Create Mixins namespace
export class Mixins {
    static Destructible: { name: string; init(): void; takeDamage(attacker: any, damage: any): void; };
    static FungusActor: { name: string; groupName: string; act(): void; init(): void };
    static Moveable: { name: string; tryMove(x: any, y: any, map: any): boolean; }
    static PlayerActor: { name: string; groupName: string; act(): void; }
    static SimpleAttacker: { name: string; groupName: string; attack(target: any): void; };
}
// Mixins Repo
// Make sure to add all new tiles as static Mixins properties
Mixins.Destructible = {
    name: 'Destructible',
    init() {
        this.hp = 1
    },
    takeDamage(attacker, damage) {
        this.hp -= damage;
        // If have 0 or less HP, then remove ourseles from the map
        if (this.hp <= 0) {
            this.map.removeEntity(this)
        }
    }
}
Mixins.Moveable = {
    name: 'Moveable',
    tryMove(x, y, map) {
        const tile = map.getTile(x, y)
        const target = map.getEntityAt(x, y)
        // If an entity was present at the tile, then we
        // can't move there
        if (target) {
            // If we are an attacker, try to attack
            // the target
            if (this.hasMixin('Attacker')) {
                this.attack(target)
                return true
            } else {
                // If not nothing we can do, but we can't 
                // move to the tile
                return false
            }
        }
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable) {
            // Update the entity's position
            this.x = x
            this.y = y
            return true
            // Check if the tile is diggable, and
            // if so try to dig it
        } else if (tile.isDiggable) {
            map.dig(x, y)
            return true
        }
        return false
    }
}
Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    act() {
        // Check if we are going to try growing this turn
        if (this.growthsRemaining > 0) {
            if (Math.random() <= 0.02) {
                // Generate the coordinates of a random adjacent square by
                // generating an offset between [-1, 0, 1] for both the x and
                // y directions. To do this, we generate a number from 0-2 and then
                // subtract 1.
                const xOffset = Math.floor(Math.random() * 3) - 1
                const yOffset = Math.floor(Math.random() * 3) - 1
                // Make sure we aren't trying to spawn on the same tile as us
                if (xOffset != 0 || yOffset != 0) {
                    // Check if we can actually spawn at that location, and if so
                    // then we grow!
                    if (this.map.isEmptyFloor(this.x + xOffset,
                        this.y + yOffset)) {
                        const entity = new Entity(Templates.FungusTemplate)
                        entity.x = this.x + xOffset
                        entity.y = this.y + yOffset
                        this.map.addEntity(entity)
                        this.growthsRemaining--
                    }
                }
            }
        }
    },
    init() {
        this.growthsRemaining = 5;
    },
}
Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act() {
        // Re-render the screen
        Game.refresh()
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.map.engine.lock();
    }
}
Mixins.SimpleAttacker = {
    name: 'SimpleAttacker',
    groupName: 'Attacker',
    attack(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            target.takeDamage(this, 1);
        }
    }
}