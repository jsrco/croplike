import Game from "../Game";

let ROT = require("rot-js");

class Map {
  constructor(tiles) {
    this._tiles = tiles;
    // Cache dimensions
    this._depth = tiles.length;
    this._width = tiles[0].length;
    this._height = tiles[0][0].length;
    // Setup the field of visions
    this._fov = [];
    this.setupFov();
    // Create table which holds entities
    this._entities = {};
    // Create table which holds items
    this._items = {};
    // Create engine and scheduler
    this._scheduler = new ROT.Scheduler.Speed();
    this._engine = new ROT.Engine(this._scheduler);
    // Setup the explored array
    this._explored = new Array(this._depth);
    this._setupExploredArray();
  }
  _setupExploredArray() {
    for (let z = 0; z < this._depth; z++) {
      this._explored[z] = new Array(this._width);
      for (let x = 0; x < this._width; x++) {
        this._explored[z][x] = new Array(this._height);
        for (let y = 0; y < this._height; y++) {
          this._explored[z][x][y] = false;
        }
      }
    }
  }
  addEntity(entity) {
    // Update entity map
    entity.setMap(this);
    // Update map with entity position
    this.updateEntityPosition(entity);
    // Check if entity is actor, if so add to scheduler
    if (entity.hasMixin("Actor")) {
      this._scheduler.add(entity, true);
    }
    // If entity is player, set player
    if (entity.hasMixin(Game.Mixins.PlayerActor)) {
      this._player = entity;
    }
  }
  addEntityAtRandomPosition(entity, z) {
    let position = this.getRandomFloorPosition(z);
    entity.setX(position.x);
    entity.setY(position.y);
    entity.setZ(position.z);
    this.addEntity(entity);
  }
  addItem(x, y, z, item) {
    // If items at that position, append the item to list
    let key = x + "," + y + "," + z;
    if (this._items[key]) {
      this._items[key].push(item);
    } else {
      this._items[key] = [item];
    }
  }
  addItemAtRandomPosition(item, z) {
    let position = this.getRandomFloorPosition(z);
    this.addItem(position.x, position.y, position.z, item);
  }
  dig(x, y, z) {
    // If diggable, update to floor
    if (this.getTile(x, y, z).isDiggable()) {
      this._tiles[z][x][y] = Game.Tile.floorTile;
    }
  }
  getDepth() {
    return this._depth;
  }
  getEngine() {
    return this._engine;
  }
  getEntities() {
    return this._entities;
  }
  getEntityAt(x, y, z) {
    // Get entity based on position
    return this._entities[x + "," + y + "," + z];
  }
  getEntitiesWithinRadius(centerX, centerY, centerZ, radius) {
    let results = [];
    // Determine our bounds
    let leftX = centerX - radius;
    let rightX = centerX + radius;
    let topY = centerY - radius;
    let bottomY = centerY + radius;
    // Iterate through our entities, adding any which are within the bounds
    for (let key in this._entities) {
      let entity = this._entities[key];
      if (
        entity.getX() >= leftX &&
        entity.getX() <= rightX &&
        entity.getY() >= topY &&
        entity.getY() <= bottomY &&
        entity.getZ() === centerZ
      ) {
        results.push(entity);
      }
    }
    return results;
  }
  getFov(depth) {
    return this._fov[depth];
  }
  getHeight() {
    return this._height;
  }
  getItemsAt(x, y, z) {
    return this._items[x + "," + y + "," + z];
  }
  getPlayer() {
    return this._player;
  }
  getRandomFloorPosition(z) {
    // Randomly generate a tile which is a floor
    let x, y;
    do {
      x = Math.floor(Math.random() * this._width);
      y = Math.floor(Math.random() * this._height);
    } while (!this.isEmptyFloor(x, y, z));
    return { x: x, y: y, z: z };
  }
  // Gets the tile for coordinate set
  getTile(x, y, z) {
    // Make sure inside bounds, if not return null
    if (
      x < 0 ||
      x >= this._width ||
      y < 0 ||
      y >= this._height ||
      z < 0 ||
      z >= this._depth
    ) {
      return Game.Tile.nullTile;
    } else {
      return this._tiles[z][x][y] || Game.Tile.nullTile;
    }
  }
  getWidth() {
    return this._width;
  }
  isEmptyFloor(x, y, z) {
    // Check if floor and has no entity
    return (
      this.getTile(x, y, z) === Game.Tile.floorTile &&
      !this.getEntityAt(x, y, z)
    );
  }
  isExplored(x, y, z) {
    // Only return if within bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
      return this._explored[z][x][y];
    } else {
      return false;
    }
  }
  removeEntity(entity) {
    // Remove entity from map
    let key = entity.getX() + "," + entity.getY() + "," + entity.getZ();
    if (this._entities[key] === entity) {
      delete this._entities[key];
    }
    // If entity is actor, remove from scheduler
    if (entity.hasMixin("Actor")) {
      this._scheduler.remove(entity);
    }
    // If entity is player, update
    if (entity.hasMixin(Game.Mixins.PlayerActor)) {
      this._player = undefined;
    }
  }
  setExplored(x, y, z, state) {
    // Only update if tile is in bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
      this._explored[z][x][y] = state;
    }
  }
  setItemsAt(x, y, z, items) {
    // If item array empty, then delete key from table
    let key = x + "," + y + "," + z;
    if (items.length === 0) {
      if (this._items[key]) {
        delete this._items[key];
      }
    } else {
      // Update the items at key
      this._items[key] = items;
    }
  }
  setupFov() {
    // Keep this in 'map' variable so that we don't lose it
    let map = this;
    // Iterate through each depth level, setting up the field of vision
    for (let z = 0; z < this._depth; z++) {
      let depth = z;
      map._fov.push(
        new ROT.FOV.DiscreteShadowcasting(
          function (x, y) {
            return !map.getTile(x, y, depth).isBlockingLight();
          },
          { topology: 4 }
        )
      );
    }
  }
  updateEntityPosition(entity, oldX, oldY, oldZ) {
    // Delete old key same entity and have old positions
    // Don't check using a falsy, clone situations
    if (typeof oldX === "number") {
      let oldKey = oldX + "," + oldY + "," + oldZ;
      if (this._entities[oldKey] === entity) {
        delete this._entities[oldKey];
      }
    }
    // Make sure the entity's position is within bounds
    if (
      entity.getX() < 0 ||
      entity.getX() >= this._width ||
      entity.getY() < 0 ||
      entity.getY() >= this._height ||
      entity.getZ() < 0 ||
      entity.getZ() >= this._depth
    ) {
      throw new Error("Entity position is out of bounds.");
    }
    // Sanity check to make sure there is no entity at new position
    let key = entity.getX() + "," + entity.getY() + "," + entity.getZ();
    if (this._entities[key]) {
      throw new Error("Tried to add entity at occupied position.");
    }
    // Add entity to table of entities
    this._entities[key] = entity;
  }
}

export default Map;
