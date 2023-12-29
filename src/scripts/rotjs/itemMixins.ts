import { ColorSwatch } from './colorSwatch'
import { Game } from './diesel'
import { EntityRepository } from './entities'
import { Screen } from './screen'
import { sendMessage, sendMessageNearby, setPosition } from './utility'


export class ItemMixins {
    static Edible: { name: string; describe(): any; eat(entity: any): void; hasRemainingConsumptions(): boolean; init(template: any): void; listeners: { details(): { key: string; value: any }[] } }
    static Equippable: { name: string; init(template: any): void; listeners: { details(): any[] } }
}

ItemMixins.Edible = {
    name: 'Edible',
    describe() {
        if (this.maxConsumptions != this.remainingConsumptions) {
            return 'partly eaten ' + this.name
        } else {
            return this.name
        }
    },
    eat(entity) {
        if (entity.hasMixin('FoodConsumer')) {
            if (this.hasRemainingConsumptions()) {
                entity.modifyFullnessBy(this.foodValue)
                this.remainingConsumptions--
            }
        }
    },
    hasRemainingConsumptions() {
        return this.remainingConsumptions > 0
    },
    init(template) {
        this.foodValue = template['foodValue'] || 5
        this.maxConsumptions = template['consumptions'] || 1
        this.remainingConsumptions = this.maxConsumptions
    },
    listeners: {
        details() {
            return [{key: 'food', value: this.foodValue}]
        }
    },
}
ItemMixins.Equippable = {
    name: 'Equippable',
    init(template) {
        this.attackValue = template['attackValue'] || 0
        this.defenseValue = template['defenseValue'] || 0
        this.wieldable = template['wieldable'] || false
        this.wearable = template['wearable'] || false
    },
    listeners: {
        details() {
            const results = []
            if (this.wieldable) results.push({key: 'attack', value: this.attackValue})
            if (this.wearable) results.push({key: 'defense', value: this.defenseValue})
            return results
        }
    }
}