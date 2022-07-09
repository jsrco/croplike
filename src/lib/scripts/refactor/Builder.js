import Game from "./Game";

let ROT = require("rot-js");

class Builder {
  constructor(width, height, depth) {
    this._depth = depth;
    this._height = height;
    this._regions = new Array(depth);
    this._tiles = new Array(depth);
    this._width = width;
    // Multi-dimension array
    for (let z = 0; z < depth; z++) {
      // Create new cave at each level
      this._tiles[z] = this._generateLevel();
      // Setup regions array for each depth
      this._regions[z] = new Array(width);
      for (let x = 0; x < width; x++) {
        this._regions[z][x] = new Array(height);
        // Fill with 0s
        for (let y = 0; y < height; y++) {
          this._regions[z][x][y] = 0;
        }
      }
    }
    for (let z = 0; z < this._depth; z++) {
      this._setupRegions(z);
    }
    this._connectAllRegions();
  }
  _canFillRegion(x, y, z) {
    // Make sure the tile in bounds
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x >= this._width ||
      y >= this._height ||
      z >= this._depth
    ) {
      return false;
    }
    // Check tile doesn't have region
    if (this._regions[z][x][y] !== 0) {
      return false;
    }
    // Check if walkable
    return this._tiles[z][x][y].isWalkable();
  }
  // Try to connect two regions, calculate where overlap and add stairs
  _connectRegions(z, r1, r2) {
    let overlap = this._findRegionOverlaps(z, r1, r2);
    // Make sure overlap
    if (overlap.length === 0) {
      return false;
    }
    // Select first tile from overlap, change it to stairs
    let point = overlap[0];
    this._tiles[z][point.x][point.y] = Game.Tile.stairsDownTile;
    this._tiles[z + 1][point.x][point.y] = Game.Tile.stairsUpTile;
    return true;
  }
  // Try to connect regions for each depth,  start from
  _connectAllRegions() {
    for (let z = 0; z < this._depth - 1; z++) {
      // Iterate through tiles, if haven't tried, connect region of tile on both depths, store connected properties as strings for fast lookup
      let connected = {};
      let key;
      for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
          key = this._regions[z][x][y] + "," + this._regions[z + 1][x][y];
          if (
            this._tiles[z][x][y] === Game.Tile.floorTile &&
            this._tiles[z + 1][x][y] === Game.Tile.floorTile &&
            !connected[key]
          ) {
            // Tiles are floors and haven't already connected the two regions
            this._connectRegions(
              z,
              this._regions[z][x][y],
              this._regions[z + 1][x][y]
            );
            connected[key] = true;
          }
        }
      }
    }
  }
  _fillRegion(region, x, y, z) {
    let tilesFilled = 1;
    let tiles = [{ x: x, y: y }];
    let tile;
    let neighbors;
    // Update region of original tile
    this._regions[z][x][y] = region;
    // Keep looping while tiles to process
    while (tiles.length > 0) {
      tile = tiles.pop();
      // Get neighbors of tile
      neighbors = Game.getNeighborPositions(tile.x, tile.y);
      // Iterate through  neighbors, check if can use to fill, if so update region, add to processing list
      while (neighbors.length > 0) {
        tile = neighbors.pop();
        if (this._canFillRegion(tile.x, tile.y, z)) {
          this._regions[z][tile.x][tile.y] = region;
          tiles.push(tile);
          tilesFilled++;
        }
      }
    }
    return tilesFilled;
  }
  // Fetches list of points that overlap between regions at iven depth and a region a level beneath
  _findRegionOverlaps(z, r1, r2) {
    let matches = [];
    // Iterate through all tiles, checking if in region and is floor, prevent two stairs one tile
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (
          this._tiles[z][x][y] === Game.Tile.floorTile &&
          this._tiles[z + 1][x][y] === Game.Tile.floorTile &&
          this._regions[z][x][y] === r1 &&
          this._regions[z + 1][x][y] === r2
        ) {
          matches.push({ x: x, y: y });
        }
      }
    }
    // Shuffle list, prevent bias
    return Game.randomize(matches);
  }
  _generateLevel() {
    // Create the empty map
    let map = new Array(this._width);
    for (let w = 0; w < this._width; w++) {
      map[w] = new Array(this._height);
    }
    // Setup the cave generator
    let generator = new ROT.Map.Cellular(this._width, this._height)
    generator.randomize(0.5);
    let totalIterations = 3;
    // Iteratively smoothen the map
    for (let i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }
    // Smoothen it last time, update map
    generator.create((x, y, v) => {
      if (v === 1) {
        map[x][y] = Game.Tile.floorTile;
      } else {
        map[x][y] = Game.Tile.wallTile;
      }
    });
    return map;
  }
  // This remove  tiles at a given depth / region, fills with wall
  _removeRegion(region, z) {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._regions[z][x][y] === region) {
          // Clear region, set the tile to wall
          this._regions[z][x][y] = 0;
          this._tiles[z][x][y] = Game.Tile.wallTile;
        }
      }
    }
  }
  // This sets up the regions for a given depth level.
  _setupRegions(z) {
    let region = 1;
    let tilesFilled;
    // Iterate through all tiles searching for a tile that
    // can be used as the starting point for a flood fill
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._canFillRegion(x, y, z)) {
          // Try to fill
          tilesFilled = this._fillRegion(region, x, y, z);
          // If it was too small, simply remove it
          if (tilesFilled <= 20) {
            this._removeRegion(region, z);
          } else {
            region++;
          }
        }
      }
    }
  }
  getTiles() {
    return this._tiles;
  }
  getDepth() {
    return this._depth;
  }
  getWidth() {
    return this._width;
  }
  getHeight() {
    return this._height;
  }
}

export default Builder;
