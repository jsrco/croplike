import BossCavern from "./maps/BossCavern";
import Game from "./Game";
import DynamicGlyph from "./DynamicGlyph";

class Entity extends DynamicGlyph {
  constructor(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    // Call glyph constructor with set of properties
    super(properties);
    // Properties from the passed object
    this._alive = true;
    this._map = null;
    // Acting speed
    this._speed = properties["speed"] || 1000;
    this._x = properties["x"] || 0;
    this._y = properties["y"] || 0;
    this._z = properties["z"] || 0;
  }
  getMap() {
    return this._map;
  }
  getSpeed() {
    return this._speed;
  }
  getX() {
    return this._x;
  }
  getY() {
    return this._y;
  }
  getZ() {
    return this._z;
  }
  isAlive() {
    return this._alive;
  }
  kill(message) {
    // Only kill once
    if (!this._alive) {
      return;
    }
    this._alive = false;
    if (message) {
      Game.sendMessage(this, message);
    } else {
      Game.sendMessage(this, "You have died!");
    }

    // Check if player died, if so call act method to prompt user
    if (this.hasMixin(Game.Mixins.PlayerActor)) {
      this.act();
    } else {
      this.getMap().removeEntity(this);
    }
  }
  outOfBounds(x, y) {
    // Stops the player from going off screen. This was removed in the tutorial.
    // This is lesson 10 B kicking off. Shit will change soon.
    return x < 0 || y < 0 || x >= this._map._width || y >= this._map._height;
  }
  setMap(map) {
    this._map = map;
  }
  setPosition(x, y, z) {
    let oldX = this._x;
    let oldY = this._y;
    let oldZ = this._z;
    // Update position
    this._x = x;
    this._y = y;
    this._z = z;
    // If entity is on map, notify map that entity moved.
    if (this._map) {
      this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
  }
  setSpeed(speed) {
    this._speed = speed;
  }
  setX(x) {
    this._x = x;
  }
  setY(y) {
    this._y = y;
  }
  setZ(z) {
    this._z = z;
  }
  switchMap(newMap) {
    // If it's the same map, do nothing
    if (newMap === this.getMap()) {
      return;
    }
    this.getMap().removeEntity(this);
    // Clear the position
    this._x = 0;
    this._y = 0;
    this._z = 0;
    // Add to new map
    newMap.addEntity(this);
  }
  tryMove(x, y, z) {
    let map = this.getMap();
    if (this.outOfBounds(x, y)) {
      Game.sendMessage(this, "the undefined do not permit this");
    } else {
      if (this._x === x && this._y === y && this._z === z) {
        Game.sendMessage(this, "you wait");
        return false;
      }
      // Must use starting z
      let tile = map.getTile(x, y, this.getZ());
      let target = map.getEntityAt(x, y, this.getZ());
      // If z level change, check if on stair
      if (z < this.getZ()) {
        if (tile !== Game.Tile.stairsUpTile) {
          Game.sendMessage(this, "You can't go up here!");
        } else {
          Game.sendMessage(this, "You ascend to level %d!", [z + 1]);
          this.setPosition(x, y, z);
        }
      } else if (z > this.getZ()) {
        if (
          tile === Game.Tile.holeToCavernTile &&
          this.hasMixin(Game.Mixins.PlayerActor)
        ) {
          // Switch entity to boss cavern
          this.switchMap(new BossCavern());
        } else if (tile !== Game.Tile.stairsDownTile) {
          Game.sendMessage(this, "You can't go down here!");
        } else {
          this.setPosition(x, y, z);
          Game.sendMessage(this, "You descend to level %d!", [z + 1]);
        }
        // If entity present
      } else if (target) {
        // Entity can only attack if the entity has Attacker and entity or target is player
        if (
          this.hasMixin("Attacker") &&
          (this.hasMixin(Game.Mixins.PlayerActor) ||
            target.hasMixin(Game.Mixins.PlayerActor))
        ) {
          this.attack(target);
          return true;
        }
        // If no, do nothing
        return false;
        // Check if can walk, then walk if so
      } else if (tile.isWalkable()) {
        // Update entity position

        this.setPosition(x, y, z);
        // Notify entity, item at position
        let items = this.getMap().getItemsAt(x, y, z);
        if (items) {
          if (items.length === 1) {
            Game.sendMessage(this, "You see %s.", [items[0].describeA()]);
          } else {
            Game.sendMessage(this, "There are several objects here.");
          }
        }
        return true;
        // Check tile is diggable
      } else if (tile.isDiggable()) {
        // Only dig if entity is player
        if (this.hasMixin(Game.Mixins.PlayerActor)) {
          map.dig(x, y, z);
          return true;
        }
        // If no, do nothing
        return false;
      }
      return false;
    }
  }
}

export default Entity;
