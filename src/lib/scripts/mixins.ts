import { Game } from './diesel'
import { Templates } from './entities'
import { Entity } from './entity'
export class Mixins {
    static Destructible: { name: string, init(): void, takeDamage(attacker: any, damage: any): void }
    static FungusActor: { name: string, groupName: string, act(): void, init(): void }
    static Moveable: { name: string, tryMove(x: any, y: any, map: any): boolean }
    static PlayerActor: { name: string, groupName: string, act(): void }
    static SimpleAttacker: { name: string, groupName: string, attack(target: any): void }
}
Mixins.Destructible = {
    name: 'Destructible',
    init() {
        this.hp = 1
    },
    takeDamage(attacker, damage) {
        this.hp -= damage
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
        if (target) {
            if (this.hasMixin('Attacker')) {
                this.attack(target)
                return true
            } else {
                return false
            }
        }
        if (tile.isWalkable) {
            this.x = x
            this.y = y
            return true
        } else if (tile.isDiggable) {
            map.dig(x, y)
            return true
        }
        return false
    }
}
Mixins.FungusActor = {
    name: 'FungusActor',
    //FungusGrowthActor
    groupName: 'Actor',
    act() {
        if (this.growthsRemaining < 4) this.character = 'fThick'
        if (this.growthsRemaining < 3) this.character = 'fFancy'
        if (this.growthsRemaining < 2) this.character = 'F'
        if (this.growthsRemaining < 1) this.character = 'f'
        if (this.growthsRemaining > 0) {
            if (Math.random() <= 0.02) {
                const xOffset = Math.floor(Math.random() * 3) - 1
                const yOffset = Math.floor(Math.random() * 3) - 1
                if (xOffset != 0 || yOffset != 0) {
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
        this.growthsRemaining = 5
    },
}
Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act() {
        Game.refresh()
        this.map.engine.lock();
    }
}
Mixins.SimpleAttacker = {
    name: 'SimpleAttacker',
    groupName: 'Attacker',
    attack(target) {
        if (target.hasMixin('Destructible')) {
            target.takeDamage(this, 1);
        }
    }
}