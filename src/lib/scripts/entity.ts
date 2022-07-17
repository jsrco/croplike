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
  x:number
  y:number
  constructor(properties: { character?: string; foreground?: string; background?: string, blocksLight?: boolean, description?: string, isDiggable?: boolean, isWalkable?: boolean, mixins?: any }, x?: number, y?: number) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {}
    // Call glyph constructor with set of properties
    super(properties)
    // Call the Glyph constructor with properties, set up the properties, use false by default
    this.blocksLight =
      properties.blocksLight || true
    this.description = properties.description || ''
    this.isDiggable = properties.isDiggable || false
    this.isWalkable = properties.isWalkable || false
    this.map = null
    this.x = x || null
    this.y = y || null
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this.attachedMixins = {}
    // Create a similar object for groups
    this.attachedMixinGroups = {}
    // Setup the object's mixins
    const mixins = properties.mixins || []
    for (let i = 0; i < mixins.length; i++) {
      // Copy over all properties from each mixin but name, init, and listeners, make sure not to override a property that already exists
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
      // Add name of mixin to attached mixins
      this.attachedMixins[mixins[i].name] = true
      // If a group name is present, add it
      if (mixins[i].groupName) {
        this.attachedMixinGroups[mixins[i].groupName] = true
      }
    }
    for (let i = 0; i < mixins.length; i++) {
      // Call init
      if (mixins[i].init) {
        mixins[i].init.call(this, properties)
      }
    }
  }
  hasMixin(obj: any): any {
    // Allow passing the mixin itself or the name as a string
    if (typeof obj === 'object') {
      return this.attachedMixins[obj.name]
    } else {
      return this.attachedMixins[obj] || this.attachedMixinGroups[obj]
    }
  }
}