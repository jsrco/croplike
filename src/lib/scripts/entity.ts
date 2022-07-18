import { Glyph } from './glyph'
import type { Map } from './map'
export class Entity extends Glyph {
  attachedMixins: any
  attachedMixinGroups: any
  blocksLight: boolean
  description: string
  isDiggable: boolean
  isWalkable: boolean
  map: Map
  x: number
  y: number
  constructor(properties: { character?: string; foreground?: string; background?: string, blocksLight?: boolean, description?: string, isDiggable?: boolean, isWalkable?: boolean, mixins?: any }, x?: number, y?: number) {
    properties = properties || {}
    super(properties)
    this.blocksLight =
      properties.blocksLight || true
    this.description = properties.description || ''
    this.isDiggable = properties.isDiggable || false
    this.isWalkable = properties.isWalkable || false
    this.map = null
    this.x = x || null
    this.y = y || null
    this.attachedMixins = {}
    this.attachedMixinGroups = {}
    const mixins = properties.mixins || []
    for (let i = 0; i < mixins.length; i++) {
      for (const key in mixins[i]) {
        if (
          key !== 'init' &&
          key !== 'name' &&
          key !== 'listeners' &&
          // eslint-disable-next-line no-prototype-builtins
          !this.hasOwnProperty(key)
        ) {
          this[key] = mixins[i][key]
        }
      }
      this.attachedMixins[mixins[i].name] = true
      if (mixins[i].groupName) {
        this.attachedMixinGroups[mixins[i].groupName] = true
      }
    }
    for (let i = 0; i < mixins.length; i++) {
      if (mixins[i].init) {
        mixins[i].init.call(this, properties)
      }
    }
  }
  hasMixin(obj: any): any {
    if (typeof obj === 'object') {
      return this.attachedMixins[obj.name]
    } else {
      return this.attachedMixins[obj] || this.attachedMixinGroups[obj]
    }
  }
}