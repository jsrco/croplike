import ColorSwatch from "./ColorSwatch";

class Tiles {
  constructor(properties) {
    this.bg = properties.bg || ColorSwatch.bgDark;
    this.char = properties.char || "";
    this.explored = false;
    this.fg = properties.fg || ColorSwatch.red[4];
    this.lightPasses = properties.lightPasses || false;
    this.walkable = properties.walkable || false;
  }
}

Tiles.nullTILE = new Tiles({
  char: "%",
  fg: ColorSwatch.bgDark,
});

Tiles.floorTILE = new Tiles({
  char: ".",
  fg: ColorSwatch.red[9],
  lightPasses: true,
  walkable: true,
});

Tiles.wallTILE = new Tiles({
  char: "#",
  fg: ColorSwatch.red[9],
});

export default Tiles;
