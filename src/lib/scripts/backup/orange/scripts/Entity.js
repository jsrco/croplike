import Tiles from "./Tiles";

class Entity extends Tiles {
  constructor(properties) {
    super(properties);
    this.facing = 4;
    this.map = properties.map || null;
    this.name = properties.name || "todo";
    this.x = properties.x || 0;
    this.y = properties.y || 0;
  }
  outOfBounds(x, y) {
    // Stops the player from going off screen
    const { mapWidth, mapHeight } = this.map;
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  tryMove(x, y) {
    if (this.outOfBounds(x, y)) {
      return false;
    } else {
      if (this.x === x && this.y === y) {
        return true;
      }
      let tile = this.map.tiles[x][y];
      if (tile.walkable) {
        this.setPosition(x, y);
        return true;
      }
      return false;
    }
  }
}

export default Entity;
