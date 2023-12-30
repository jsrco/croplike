import { ColorSwatch } from './colorSwatch'
import { Game } from './diesel'
import { EntityRepository } from './entities'
import { ItemRepository } from './item'
import { Path } from 'rot-js'
import { Screen } from './screen'
import { extend, randomize, sendMessage, sendMessageNearby, setPosition } from './utility'


export class EntityMixins {
    static Attacker: { name: string; groupName: string; attack(target: any): void; getAttackValue(): any; increaseAttackValue(value: any): void; listeners: {
        details(): {
            key: string;
            value: any;
        }[];
    } }
    static CorpseDropper: {
        name: string; init(template: any): void; listeners: {
            onDeath(attacker: any): void;
        }
    }
    static Destructible: {
        name: string; getDefenseValue(): any; increaseDefenseValue(value: any): void; increaseMaxHp(value: any): void; init(template: any): void; listeners: {
            details(): {
                key: string;
                value: any;
            }[]
            onGainLevel(): void;
        }; takeDamage(attacker: any, damage: any): void
    }
    static Equipper: { name: string; equip(item: any): void; init(template: any): void; takeOff(): void; unequip(item: any): void; unwield(): void; }
    static ExperienceGainer: {
        name: string; getNextLevelExperience(): number; giveExperience(points: any): void; init(template: any): void, listeners: {
            details(): {
                key: string;
                value: any;
            }[]
            onKill(victim: any): void;
        }
    }
    static FoodConsumer: { name: string; addTurnHunger():void; consume(item: string):void; getHungerState(): string; init(template: any): void; modifyFullnessBy(points: any): void }
    static FungusActor: { name: string; groupName: string; act(): void; init(): void }
    static GiantZombieActor: any
    static InventoryHolder: { name: string; addItem(item: any): boolean; canAddItem(): boolean; dropItem(i: any): void; init(template: any): void; pickupItems(indices: any): boolean; removeItem(i: any): void }
    static MessageRecipient: { name: string; clearMessages(): void; init(template: any): void; receiveMessage(message: any): void }
    static PlayerActor: { name: string; groupName: string; act(): void }
    static PlayerStatGainer: {
        name: string; groupName: string; listeners: {
            onGainLevel: () => void;
        }
    }
    static RandomStatGainer: {
        name: string; groupName: string; listeners: {
            onGainLevel: () => void;
        }
    }
    static Sight: { name: string; groupName: string; canSee(entity: any): boolean; increaseSightRadius(value: any): void; init(template: any): void }
    static TaskActor: { name: string; groupName: string; act(): void; canDoTask(task: any): any; hunt(): void; init(template: any): void; wander(): void }
}
EntityMixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    attack(target) {
        if (target.hasMixin('Destructible')) {
            const max = Math.max(0, this.attackValue - target.defenseValue)
            const damage = 1 + Math.floor(Math.random() * max)
            sendMessage(this, `${this.describe()} strikes the ${target.describe()} for ${damage} damage!`)
            sendMessage(target, `The ${this.describe()} strikes ${target.describe()} for ${damage} damage!`)
            target.takeDamage(this, damage)
        }
    },
    getAttackValue() {
        let modifier = 0;
        if (this.hasMixin(EntityMixins.Equipper)) {
            if (this.weapon) modifier += this.weapon.attackValue
            if (this.armor) modifier += this.armor.attackValue
        }
        return this.attackValue + modifier
    },
    increaseAttackValue(value) {
        value = value || 2
        this.attackValue += value
        sendMessage(this, "You look stronger!")
    },
    listeners: {
        details() {
            return [{key: 'attack', value: this.attackValue}]
        }
    }
}
EntityMixins.CorpseDropper = {
    name: 'CorpseDropper',
    init(template) {
        this.corpseDropRate = template['corpseDropRate'] || 100
    },
    listeners: {
        onDeath(attacker) {
            if (Math.round(Math.random() * 100) <= this.corpseDropRate) {
                // Create a new corpse item and drop it.
                this.map.addItem(this.x, this.y, this.z,
                    ItemRepository.create('corpse', {
                        name: this.describe() + ' corpse',
                        foreground: this.foreground
                    }))
            }
        }
    }
}
EntityMixins.Destructible = {
    name: 'Destructible',
    getDefenseValue() {
        let modifier = 0
        if (this.hasMixin(EntityMixins.Equipper)) {
            if (this.weapon) {
                modifier += this.weapon.defenseValue
            }
            if (this.armor) {
                modifier += this.armor.defenseValue
            }
        }
        return this.defenseValue + modifier
    },
    increaseDefenseValue(value) {
        value = value || 2
        this.defenseValue += value
        sendMessage(this, "You look tougher!")
    },
    increaseMaxHp(value) {
        value = value || 10
        this.maxHp += value
        this.hp += value
        sendMessage(this, "You look healthier!")
    },
    init(template) {
        this.maxHp = template['maxHp'] || 10
        this.hp = template['hp'] || this.maxHp
        this.defenseValue = template['defenseValue'] || 0
    },
    listeners: {
        details() {
            return [
                {key: 'defense', value: this.getDefenseValue()},
                {key: 'hp', value: this.hp}
            ];
        },
        onGainLevel() {
            this.hp = this.maxHp
        }
    },
    takeDamage(attacker, damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            sendMessage(attacker, `You kill the ${this.describe()}!`)
            // Raise events
            this.raiseEvent('onDeath', attacker)
            attacker.raiseEvent('onKill', this)
            this.kill()
        }
    }
}
EntityMixins.Equipper = {
    name: 'Equipper',    
    equip(item) {
        if (item.wieldable) {
            this.weapon = item
            sendMessage(this, `You are wielding ${item.describeA()}`)
        }
        if (item.wearable) {
            this.armor = item
            sendMessage(this.player, `You are wearing ${item.describeA()}`)
        }
    },
    init(template) {
        this.weapon = null
        this.armor = null
    },
    takeOff() {
        this.armor = null
    },
    unequip(item) {
        if (this.weapon === item) {
            this.unwield()
        }
        if (this.armor === item) {
            this.takeOff()
        }
    },
    unwield() {
        this.weapon = null
    }
}
EntityMixins.ExperienceGainer = {
    name: 'ExperienceGainer',
    getNextLevelExperience() {
        return (this.level * this.level) * 10
    },
    giveExperience(points) {
        let levelsGained = 0
        while (points > 0) {
            if (this.experience + points >= this.getNextLevelExperience()) {
                const usedPoints = this.getNextLevelExperience() - this.experience
                points -= usedPoints
                this.experience += usedPoints
                this.level++
                levelsGained++
                this.statPoints += this.statPointsPerLevel
            } else {
                this.experience += points;
                points = 0;
            }
        }
        if (levelsGained > 0) {
            sendMessage(this, "You advance to level " + this.level)
            this.raiseEvent('onGainLevel')
        }
    },
    init(template) {
        this.level = template['level'] || 1
        this.experience = template['experience'] || 0
        this.statPointsPerLevel = template['statPointsPerLevel'] || 1
        this.statPoints = 0
        this.statOptions = []
        if (this.hasMixin('Attacker')) {
            this.statOptions.push(['Increase attack value', this.increaseAttackValue])
        }
        if (this.hasMixin('Destructible')) {
            this.statOptions.push(['Increase defense value', this.increaseDefenseValue])
            this.statOptions.push(['Increase max health', this.increaseMaxHp])
        }
        if (this.hasMixin('Sight')) {
            this.statOptions.push(['Increase sight range', this.increaseSightRadius])
        }
    },
    listeners: {
        details() {
            return [{key: 'level', value: this.level}]
        },
        onKill(victim) {
            let exp = victim.maxHp + victim.getDefenseValue()
            if (victim.hasMixin('Attacker')) {
                exp += victim.getAttackValue()
            }
            if (victim.hasMixin('ExperienceGainer')) {
                exp -= (this.level - victim.level) * 3
            }
            if (exp > 0) {
                this.giveExperience(exp)
            }
        }
    }
}
EntityMixins.FoodConsumer = {
    name: 'FoodConsumer',
    addTurnHunger() {
        this.modifyFullnessBy(-this.fullnessDepletionRate)
    },
    consume(i) {
        const item = this.items[i]
        sendMessage(this, `You eat ${item.describeThe()}`)
        item.eat(this)
        if (!item.hasRemainingConsumptions()) {
            this.removeItem(i)
        }
    },
    getHungerState() {
        const perPercent = this.maxFullness / 100
        if (this.fullness <= perPercent * 5) {
            return `Starving`
        } else if (this.fullness <= perPercent * 35) {
            return `Hungry`
        } else if (this.fullness >= perPercent * 75) {
            return `Full`
        } else if (this.fullness >= perPercent * 90) {
            return `Not Hungry`
        } else {
            return `Semi-full`
        }
    },
    init(template) {
        this.maxFullness = template['maxFullness'] || 750
        this.fullness = template['fullness'] || (this.maxFullness / 2)
        this.fullnessDepletionRate = template['fullnessDepletionRate'] || 1
    },
    modifyFullnessBy(points) {
        this.fullness = this.fullness + points;
        if (this.fullness <= 0) {
            this.kill("You have died of starvation!")
        } else if (this.fullness > this.maxFullness) {
            this.kill("You choke and die!")
        }
    }
}
EntityMixins.FungusActor = {
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
                        this.y + yOffset, this.z)) {
                        const entity = EntityRepository.create('fungus')
                        setPosition(entity, this.x + xOffset, this.y + yOffset, this.z)
                        this.map.addEntity(entity)
                        this.growthsRemaining--
                        sendMessageNearby(this.map,
                            entity.x, entity.y, entity.z,
                            `The fungus is spreading!`)
                    }
                }
            }
        }
    },
    init() {
        this.growthsRemaining = 5
    },
}
EntityMixins.GiantZombieActor = extend(EntityMixins.TaskActor, {
    growArm() {
        this.hasGrownArm = true
        this.increaseAttackValue(5)
        sendMessageNearby(this.map,
            this.x, this.y, this.z,
            'An extra arm appears on the giant zombie!')
    },
    spawnSlime() {
        const xOffset = Math.floor(Math.random() * 3) - 1
        const yOffset = Math.floor(Math.random() * 3) - 1

        if (!this.map.isEmptyFloor(this.x + xOffset, this.y + yOffset,
            this.z)) {
            return
        }
        const slime = EntityRepository.create('slime')
        slime.x = this.x + xOffset
        slime.y = this.y + yOffset
        slime.z = this.z
        this.map.addEntity(slime)
    },
    listeners: {
        onDeath(attacker) {
            Game.switchScreen(Screen.winScreen)
        }
    }
})
EntityMixins.InventoryHolder = {
    name: 'InventoryHolder',
    addItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i]) {
                this.items[i] = item
                return true
            }
        }
        return false
    },
    canAddItem() {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i]) {
                return true
            }
        }
        return false
    },
    dropItem(i) {
        if (this.items[i]) {
            if (this.map) {
                this.map.addItem(this.x, this.y, this.z, this.items[i])
            }
            sendMessage(this, `You drop ${this.items[i].describeThe()}`)
            this.removeItem(i)
        }
    },
    init(template) {
        const inventorySlots = template['inventorySlots']
        this.items = new Array(inventorySlots)
    },
    pickupItems(indices) {
        const mapItems = this.map.getItemsAt(this.x, this.y, this.z)
        let added = 0
        for (let i = 0; i < indices.length; i++) {
            if (this.addItem(mapItems[indices[i] - added])) {
                mapItems.splice(indices[i] - added, 1)
                added++
            } else {
                // Inventory is full
                break
            }
        }
        this.map.setItemsAt(this.x, this.y, this.z, mapItems)
        return added === indices.length
    },
    removeItem(i) {
        if (this.items[i] && this.hasMixin(EntityMixins.Equipper)) {
            this.unequip(this.items[i])
        }
        this.items[i] = null
    },
}
EntityMixins.MessageRecipient = {
    name: 'MessageRecipient',
    clearMessages() {
        this.messages = []
    },
    init(template) {
        this.messages = []
    },
    receiveMessage(message) {
        this.messages.push(message)
    }
}
EntityMixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act() {
        if (this.acting) {
            return
        }
        this.acting = true
        this.addTurnHunger()
        if (!this.isAlive) {
            Screen.playScreen.gameEnded = true
            sendMessage(this, 'You have died... Press Enter to continue!')
        }
        Game.refresh()
        this.map.engine.lock()
        this.acting = false
    }
}
EntityMixins.PlayerStatGainer = {
    name: 'PlayerStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel() {
            Screen.gainStatScreen.setup(this)
            Screen.playScreen.setSubScreen(Screen.gainStatScreen)
        }
    }
}
EntityMixins.RandomStatGainer = {
    name: 'RandomStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel() {
            while (this.statPoints > 0) {
                randomize(this.statOptions)[0][1].call(this)
                this.statPoints--
            }
        }
    }
}
EntityMixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    canSee(entity) {
        if (!entity || this.map !== entity.map || this.z !== entity.z) {
            return false
        }
        const otherX = entity.x
        const otherY = entity.y
        if ((otherX - this.x) * (otherX - this.x) +
            (otherY - this.y) * (otherY - this.y) >
            this.sightRadius * this.sightRadius) {
            return false
        }
        let found = false
        this.map.fov[this.z].compute(
            this.x, this.y,
            this.sightRadius,
            (x, y, radius, visibility) => {
                if (x === otherX && y === otherY) {
                    found = true
                }
            })
        return found
    },
    increaseSightRadius(value) {
        value = value || 1
        this.sightRadius += value
        sendMessage(this, "You are more aware of your surroundings!")
    },
    init(template) {
        this.sightRadius = template['sightRadius'] || 5
    }
}
EntityMixins.TaskActor = {
    name: 'TaskActor',
    groupName: 'Actor',
    act() {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.canDoTask(this.tasks[i])) {
                this[this.tasks[i]]()
                return
            }
        }
    },
    canDoTask(task) {
        if (task === "growArm") {
            return this.hp <= 15 && !this.hasGrown
            // Spawn 5% of turns
          } else if (task === "spawnSlime") {
            return Math.round(Math.random() * 100) <= 5
          } else if (task === "hunt") {
            return this.hasMixin("Sight") && this.canSee(this.map.player)
          } else if (task === "wander") {
            return true
          } else {
            throw new Error("Tried to perform undefined task " + task)
          }
    },
    hunt() {
        const offsets = Math.abs(this.map.player.x - this.x) +
            Math.abs(this.map.player.y - this.y)
        if (offsets === 1) {
            if (this.hasMixin('Attacker')) {
                this.attack(this.map.player)
                return
            }
        }
        const path = new Path.AStar(this.map.player.x, this.map.player.y, (x, y) => {
            const entity = this.map.getEntityAt(x, y, this.z)
            if (entity && entity !== this.map.player && entity !== this) {
                return false
            }
            return this.map.getTile(x, y, this.z).isWalkable
        }, { topology: 4 })
        let count = 0;
        path.compute(this.x, this.y, (x, y) => {
            if (count == 1) {
                this.tryMove(x, y, this.z)
            }
            count++
        })
    },
    init(template) {
        this.tasks = template['tasks'] || ['wander']
    },
    wander() {
        const moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.x + moveOffset, this.y, this.z)
        } else {
            this.tryMove(this.x, this.y + moveOffset, this.z)
        }
    }
}