import { DynamicGlyph } from './dynamicGlyph'
import { EntityMixins } from './entityMixins'
import type { Map } from './map'
import { BossCavern } from './map.bossCavern'
import { Tile } from './tile'
import { sendMessage, setPosition } from './utility'
export class Entity extends DynamicGlyph {
  act: any
  attack: any
  attackValue: number
  defenseValue: number
  facing: number
  hp: number
  inventorySlots: number
  isAlive: boolean
  isDiggable: boolean
  isWalkable: boolean
  lightPasses: boolean
  map: Map
  maxHp: number
  speed: number
  x: number
  y: number
  z: number
  constructor(properties: { attackValue?: number, background?: string, character?: string, defenseValue?: number, description?: string, facing?: number, foreground?: string, hp?: number, inventorySlots?: number, isAlive?: boolean, isDiggable?: boolean, isWalkable?: boolean, maxHp?: number, mixins?: any, name?: string, speed?: number }, x?: number, y?: number, z?: number) {
    properties = properties || {}
    super(properties)
    this.attackValue = properties.attackValue
    this.facing = properties.facing || 4
    this.inventorySlots = properties.inventorySlots || 0
    this.isAlive = properties.isAlive || true
    this.isDiggable = properties.isDiggable || false
    this.isWalkable = properties.isWalkable || false
    this.map = null
    this.speed = properties.speed || 1000
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }
  getSpeed() {
    return this.speed
  }
  kill(message?) {
    if (!this.isAlive) {
      return
    }
    this.isAlive = false
    if (message) {
      sendMessage(this, message)
    } else {
      sendMessage(this, "You have died!")
    }
    if (this.hasMixin(EntityMixins.PlayerActor)) {
      this.act()
    } else {
      this.map.removeEntity(this)
    }
  }
  switchMap(newMap) {
    if (newMap === this.map) {
      return
    }
    this.map.removeEntity(this)
    this.x = 0
    this.y = 0
    this.z = 0
    newMap.addEntity(this)
  }
  tryMove(x: number, y: number, z: number) {
    const map = this.map
    const tile = map.getTile(x, y, this.z)
    const target = map.getEntityAt(x, y, this.z)
    if (z < this.z) {
      if (tile != Tile.stairsUpTile) {
        sendMessage(this, "You cannot go up here!")
      } else {
        sendMessage(this, `You ascend to level ${z + 1}!`)
        setPosition(this, x, y, z)
      }
    } else if (z > this.z) {
      if (tile === Tile.holeToCavernTile &&
        this.hasMixin(EntityMixins.PlayerActor)) {
        this.switchMap(new BossCavern())
      } else if (tile != Tile.stairsDownTile) {
        sendMessage(this, "You cannot go down here!")
      } else {
        setPosition(this, x, y, z)
        sendMessage(this, `You descend to level ${z + 1}`)
      }
    } else if (x === this.x && y === this.y && z === this.z) {
      sendMessage(this, `You wait.`)
    } else if (target) {
      if (this.hasMixin('Attacker') &&
        (this.hasMixin(EntityMixins.PlayerActor) ||
          target.hasMixin(EntityMixins.PlayerActor))) {
        this.attack(target)
        return true
      } else {
        return false
      }
    } else if (tile.isWalkable) {
      setPosition(this, x, y, z)
      const items = this.map.getItemsAt(x, y, z)
      if (items) {
        if (items.length === 1) {
          sendMessage(this, `You see ${[items[0].describeA()]}`)
        } else {
          sendMessage(this, 'There are several objects here.')
        }
      }
      return true
    } else if (tile.isDiggable) {
      if (this.hasMixin(EntityMixins.PlayerActor)) {
        map.dig(x, y, z)
        return true
      }
    }
    return false
  }
}