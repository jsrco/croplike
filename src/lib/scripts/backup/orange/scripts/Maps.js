import Tiles from "./Tiles";

class Maps {
  constructor(properties) {
    this.entities = {};
    this.mapHeight = properties.mapHeight;
    this.mapWidth = properties.mapWidth;
    this.tiles = [];
    this.builder();
  }
  builder() {
    for (let x = 0; x < this.mapWidth; x++) {
      this.tiles.push([]);
      for (let y = 0; y < this.mapHeight; y++) {
        if (
          x === 0 ||
          y === 0 ||
          x === this.mapWidth - 1 ||
          y === this.mapHeight - 1 ||
          (x % 2 === 0 && y % 2 === 0) ||
          (x % 2 === 0 && y % 2 === 0)
        ) {
          this.tiles[x][y] = Tiles.wallTILE;
        } else {
          this.tiles[x][y] = Tiles.floorTILE;
        }
      }
    }
  }
}

export default Maps;
