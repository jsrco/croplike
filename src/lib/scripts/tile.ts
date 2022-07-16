import { Glyph } from "./glyph";

class Tile extends Glyph {
    blocksLight: boolean
    description: string
    isDiggable: boolean
    isWalkable: boolean
    static nullTile: Tile;
    static floorTile: Tile;
    static wallTile: Tile;
  constructor(properties: { character?: string; foreground?: string; background?: string, blocksLight?: boolean, description?: string, isDiggable?:boolean, isWalkable?:boolean }) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    // Call glyph constructor with set of properties
    super(properties);
    // Call the Glyph constructor with properties, set up the properties, use false by default
    this.blocksLight =
    properties.blocksLight || true;
    this.description = properties.description || "";
    this.isDiggable = properties.isDiggable || false;
    this.isWalkable = properties.isWalkable || false;
    }
}

Tile.nullTile = new Tile({
  description: 'Unknown'
})
Tile.floorTile = new Tile({
  character: ".",
  foreground: "#4D4C60",
  blocksLight: false,
  description: 'As far as the light allows, you see filth cover everything. The floor, it looks like it is moving.',
  isWalkable: true,
})
Tile.wallTile = new Tile({
  character: "#",
  foreground: "#4B0082",
  description: "The indigo walls give off a faint glow as you approach. Enough to let you know they are there. They look weak. Like they would crumble at the slightest touch.",
  isDiggable: true,
})

export default Tile;
