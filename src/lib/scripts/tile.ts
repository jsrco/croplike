import { Glyph } from './glyph'
export class Tile extends Glyph {
  blocksLight: boolean
  description: string
  isDiggable: boolean
  isWalkable: boolean
  static nullTile: Tile
  static floorTile: Tile
  static wallTile: Tile
  constructor(properties: { character?: string; foreground?: string; background?: string, blocksLight?: boolean, description?: string, isDiggable?: boolean, isWalkable?: boolean }) {
    properties = properties || {}
    super(properties)
    this.blocksLight =
      properties.blocksLight || true
    this.description = properties.description || ''
    this.isDiggable = properties.isDiggable || false
    this.isWalkable = properties.isWalkable || false
  }
}
Tile.nullTile = new Tile({
  description: 'Unknown'
})
Tile.floorTile = new Tile({
  character: '.',
  foreground: '#4D4C60',
  blocksLight: false,
  description: 'As far as the light allows, you see filth cover everything. The floor, it looks like it is moving.',
  isWalkable: true,
})
Tile.wallTile = new Tile({
  character: '#',
  foreground: '#4B0082',
  description: 'The indigo walls give off a faint glow as you approach. Enough to let you know they are there. They look weak. Like they would crumble at the slightest touch.',
  isDiggable: true,
})