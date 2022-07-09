import Glyph from "./Glyph";

class Tile extends Glyph {
  constructor(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    // Call glyph constructor with set of properties
    super(properties);
    // Call the Glyph constructor with properties, set up the properties, use false by default
    this._isWalkable = properties["isWalkable"] || false;
    this._isDiggable = properties["isDiggable"] || false;
    this._blocksLight =
      properties["blocksLight"] !== undefined
        ? properties["blocksLight"]
        : true;
    this._description = properties["description"] || "";
  }
  // Standard getters
  getDescription() {
    return this._description;
  }
  isBlockingLight() {
    return this._blocksLight;
  }
  isDiggable() {
    return this._isDiggable;
  }
  isWalkable() {
    return this._isWalkable;
  }
}

Tile.nullTile = new Tile({
  description: 'Unknown'
});
Tile.floorTile = new Tile({
  blocksLight: false,
  character: ".",
  description: 'As far as the light allows, you see filth cover everything. The floor, it looks like it is moving.',
  foreground: "#4D4C60",
  isWalkable: true,
});
Tile.holeToCavernTile = new Tile({
  blocksLight: false,
  character: "O",
  description: "A small hole chiseled into the ground. It emits a foul odor. A small crack mars it's edge. Flesh and filth stream from the small fissures of the crack. This is the source. A one way trip down.",
  foreground: "white",
  isWalkable: true,
});
Tile.stairsDownTile = new Tile({
  blocksLight: false,
  character: ">",
  description: "A filth covered ramp leading down.",
  foreground: "white",
  isWalkable: true,
});
Tile.stairsUpTile = new Tile({
  blocksLight: false,
  character: "<",
  description: "A filth covered ramp leading up.",
  foreground: "white",
  isWalkable: true,
});
Tile.wallTile = new Tile({
  blocksLight: true,
  character: "#",
  description: "The indigo walls give off a faint glow as you approach. Enough to let you know they are there. They look weak. Like they would crumble at the slightest touch.",
  foreground: "#4B0082",
  isDiggable: true,
});
Tile.waterTile = new Tile({
  blocksLight: false,
  character: "~",
  description: "The water looks still and clear. The filth stops at its edge.",
  foreground: "#00419E",
  walkable: false,
});

export default Tile;
