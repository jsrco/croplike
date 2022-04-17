import Game from "../Game";
import Map from "./Maps";

class BossCavern extends Map {
  constructor() {
    super(_generateTiles(80, 24));
    // Create the boss
    this.addEntityAtRandomPosition(Game.Entities.create("giant horror"), 0);
  }
  addEntity(entity) {
    // Call super method
    super.addEntity(entity);
    // If it's a player, place at random position
    if (this.getPlayer() === entity) {
      let position = this.getRandomFloorPosition(0);
      entity.setPosition(position.x, position.y, 0);
      // Start engine
      this.getEngine().start();
    }
  }
}

export default BossCavern;

let _generateTiles = (width, height) => {
  // First create array, fill with empty tiles
  let tiles = new Array(width);
  for (let x = 0; x < width; x++) {
    tiles[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      tiles[x][y] = Game.Tile.wallTile;
    }
  }
  // Now determine the radius of the cave to carve out
  let radius = (Math.min(width, height) - 2) / 2;
  _fillCircle(tiles, width / 2, height / 2, radius, Game.Tile.floorTile);

  // Now randomly position lakes (3 - 6 lakes)
  let lakes = Math.round(Math.random() * 3) + 3;
  let maxRadius = 2;
  for (let i = 0; i < lakes; i++) {
    // Random position, take into consideration the radius to make sure it is within bounds
    let centerX = Math.floor(Math.random() * (width - maxRadius * 2));
    let centerY = Math.floor(Math.random() * (height - maxRadius * 2));
    centerX += maxRadius;
    centerY += maxRadius;
    // Random radius
    let radius = Math.floor(Math.random() * maxRadius) + 1;
    // Position lake
    _fillCircle(tiles, centerX, centerY, radius, Game.Tile.waterTile);
  }

  // Return the tiles in an array, only 1 depth level
  return [tiles];
}
let _fillCircle = (tiles, centerX, centerY, radius, tile) => {
  // Copied from the DrawFilledCircle algorithm
  // http://stackoverflow.com/questions/1201200/fast-algorithm-for-drawing-filled-circles
  let x = radius;
  let y = 0;
  let xChange = 1 - (radius << 1);
  let yChange = 0;
  let radiusError = 0;

  while (x >= y) {
    for (let i = centerX - x; i <= centerX + x; i++) {
      tiles[i][centerY + y] = tile;
      tiles[i][centerY - y] = tile;
    }
    for (let i = centerX - y; i <= centerX + y; i++) {
      tiles[i][centerY + x] = tile;
      tiles[i][centerY - x] = tile;
    }

    y++;
    radiusError += yChange;
    yChange += 2;
    if ((radiusError << 1) + xChange > 0) {
      x--;
      radiusError += xChange;
      xChange += 2;
    }
  }
}
