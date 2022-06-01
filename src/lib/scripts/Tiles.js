import ColorSwatch from "./ColorSwatch";

class Tiles {
  constructor(properties) {
    this.bg = properties.bg || ColorSwatch.bgDark;
    this.char = properties.char || "";
    this.explored = false;
    this.fg = properties.fg || ColorSwatch.red[4];
    this.lightPasses = properties.lightPasses || false;
    this.name = properties.name || "todo";
    this.walkable = properties.walkable || false;
  }
}

export default Tiles;
