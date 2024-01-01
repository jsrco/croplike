import { Glyph } from './glyph'
export class Tile extends Glyph {
  description: string
  isDiggable: boolean
  isWalkable: boolean
  lightPasses: boolean
  static nullTile: Tile
  static floorTile: Tile
  static holeToCavernTile: Tile
  static stairsDownTile: Tile
  static stairsUpTile: Tile
  static wallTile: Tile
  static waterTile: Tile
  constructor(properties: { background?: string, character?: string, description?: string, foreground?: string, isDiggable?: boolean, isWalkable?: boolean, lightPasses?: boolean }) {
    properties = properties || {}
    super(properties)
    this.description = properties.description || ''
    this.isDiggable = properties.isDiggable || false
    this.isWalkable = properties.isWalkable || false    
    this.lightPasses =
    properties.lightPasses
  }
}
Tile.nullTile = new Tile({
  description: 'unknown'
})
Tile.floorTile = new Tile({
  character: '.',
  description: 'a cave floor',
  foreground: '#4D4C60',
  isWalkable: true,
  lightPasses: true,
})
Tile.holeToCavernTile = new Tile({
  character: 'skull',
  description: 'a great dark hole in the ground',
  foreground: 'white',
  isWalkable: true,
  lightPasses: true,
})
Tile.stairsDownTile = new Tile({
  character: 'stairDown',
  description: 'a rock staircase leading downwards',
  foreground: 'white',
  isWalkable: true,
  lightPasses: true
})
Tile.stairsUpTile = new Tile({
  character: 'stairUp',
  description: 'a rock staircase leading upwards',
  foreground: 'white',
  isWalkable: true
})
Tile.wallTile = new Tile({
  character: '#',
  description: 'a cave wall',
  foreground: '#4B0082',
  isDiggable: true,
})
Tile.waterTile = new Tile({
  character: 'water',
  description: 'murky blue water',
  foreground: 'blue',
  isWalkable: false,
  lightPasses: true,
})