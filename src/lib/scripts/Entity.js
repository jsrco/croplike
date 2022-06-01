import Ai from "./Ai";
import Tiles from "./Tiles";

class Entity extends Tiles {
  constructor(properties) {
    super(properties);
    this.facing = 4;
    this.map = properties.map
    this.pos = [...properties.pos] || [{ x: 0, y: 0}];
    this.ai = new Ai(this)
  }
  // Stops the player from going off screen
  canGoThere(dx, dy) {
    for (let i = 0; i < this.pos.length; i++) {
      let potPosX = this.pos[i].x + dx
      let potPosY = this.pos[i].y + dy
      let tile = this.map.tiles[potPosX][potPosY];
      if (!tile.walkable) return false
    }
    return true
  }
  checkPosition(x, y) {
    for (let i = 0; i < this.pos.length; i++) {
      if (this.pos[0].x === x && this.pos[i][1] === y) {
        return true
      }
    }
    return false
  }
  outOfBounds(dx, dy) {
    // Stops the player from going off screen
    for (let i = 0; i < this.pos.length; i++) {
      let potPosX = this.pos[i].x + dx
      let potPosY = this.pos[i].y + dy
      if (potPosX < 0 || potPosY < 0 || potPosX >= this.map.mapWidth || potPosY >= this.map.mapHeight) {
        return true
      }
    }
    return false

    // return x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight;
  }
  setPosition(dx, dy) {
    for (let i = 0; i < this.pos.length; i++) {
      this.pos[i].x += dx
      this.pos[i].y += dy
    }
  }
  // Reaction
  tryMove(dx, dy) {
    if (this.outOfBounds(dx, dy)) {
      return false;
    } else {

      let potPosX = this.pos[0].x + dx
      let potPosY = this.pos[0].y + dy

      if (this.pos[0].x === potPosX && this.pos[0].y === potPosY) {
        return true;
      }
      if (this.canGoThere(dx, dy)) {
        this.setPosition(dx, dy);
        return true;
      }
      return false;
    }
  }
}

export default Entity;
