import { Game } from './diesel'
import { Templates } from './entities'
import { Entity } from './entity'

const sendMessage = (recipient: any, message: string) => {
    if (recipient.hasMixin('MessageRecipient')) {
        recipient.receiveMessage(message);
    }
}
const sendMessageNearby = (map: any, centerX: number, centerY: number, message: string) => {
    const entities = map.getEntitiesWithinRadius(centerX, centerY, 5)
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin('MessageRecipient')) {
            entities[i].receiveMessage(message)
        }
    }
}
export class Mixins {
    static Attacker: { name: string, groupName: string, attack(target: any): void }
    static Destructible: { name: string, init(template: any): void, takeDamage(attacker: any, damage: any): void }
    static FungusActor: { name: string, groupName: string, act(): void, init(): void }
    static MessageRecipient: { name: string; init(template: any): void; receiveMessage(message: any): void; clearMessages(): void }
    static Moveable: { name: string, tryMove(x: any, y: any, map: any): boolean }
    static PlayerActor: { name: string, groupName: string, act(): void }
}

Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    attack(target) {
        if (target.hasMixin('Destructible')) {
            const max = Math.max(0, this.attackValue - target.defenseValue)
            const damage = 1 + Math.floor(Math.random() * max)
            sendMessage(this, `You strike the %c{${target.foreground}}${target.name} %c{white}for %c{red}${damage} %c{white}damage!`)
            sendMessage(target, `The %c{${target.foreground}}${this.name} %c{white}strikes you for %c{red}${damage} %c{white}damage!`)
            target.takeDamage(this, damage)
        }
    }
}
Mixins.Destructible = {
    name: 'Destructible',
    init(template) {
        this.maxHp = template['maxHp'] || 10
        this.hp = template['hp'] || this.maxHp
        this.defenseValue = template['defenseValue'] || 0
    },
    takeDamage(attacker, damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            sendMessage(attacker, `You kill the %c{${this.foreground}}${this.name}!`)
            sendMessage(this, 'You die!')
            this.map.removeEntity(this)
        }
    }
}
Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init(template) {
        this.messages = []
    },
    receiveMessage(message) {
        this.messages.push(message)
    },
    clearMessages() {
        this.messages = []
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
                        sendMessageNearby(this.map,
                            entity.x, entity.y,
                            `The %c{${this.foreground}}fungus %c{white}is spreading!`)
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
        this.map.engine.lock()
    }
}