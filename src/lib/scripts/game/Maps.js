
import ColorSwatch from "$lib/scripts/game/ColorSwatch";
import Tiles from "./Tiles";

class Maps {
  constructor(properties) {
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
          (x % 4 === 0 && y % 4 === 0)
        ) {
          this.tiles[x][y] = new Tiles({
            char: "#",
            fg: ColorSwatch.red[9],
            name: "Unbroken Wall"
          });
        } else {
          this.tiles[x][y] = new Tiles({
            char: ".",
            fg: ColorSwatch.red[9],
            lightPasses: true,
            name: "Empty Floor",
            walkable: true,
          });
        }
      }
    }
  }
}

export default Maps;


