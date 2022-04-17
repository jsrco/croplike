import Entity from "../Entity";
import { EntityRepository } from "../Entities";
import Game from "../Game";

let ROT = require("rot-js");

// Create Mixins namespace
class Mixins {}

Mixins.Attacker = {
  name: "Attacker",
  groupName: "Attacker",
  attack(target) {
    // If the target is destructible, calculate the damage
    if (target.hasMixin("Destructible")) {
      let attack = this.getAttackValue();
      let defense = target.getDefenseValue();
      let max = Math.max(0, attack - defense);
      let damage = 1 + Math.floor(Math.random() * max);
      Game.sendMessage(this, "You strike the %s for %d damage!", [
        target.getName(),
        damage,
      ]);
      Game.sendMessage(target, "The %s strikes you for %d damage!", [
        this.getName(),
        damage,
      ]);
      target.takeDamage(this, damage);
    }
  },
  getAttackValue() {
    let modifier = 0;
    // If we can equip items, then check weapon / armor
    if (this.hasMixin(Game.Mixins.Equipper)) {
      if (this.getWeapon()) {
        modifier += this.getWeapon().getAttackValue();
      }
      if (this.getArmor()) {
        modifier += this.getArmor().getAttackValue();
      }
    }
    return this._attackValue + modifier;
  },
  increaseAttackValue(value) {
    // If no value passed, default 2
    value = value || 2;
    // Add to the attack value
    this._attackValue += value;
    Game.sendMessage(this, "You look stronger!");
  },
  init(template) {
    this._attackValue = template["attackValue"] || 1;
  },
  listeners: {
    details() {
      return [{ key: "attack", value: this.getAttackValue() }];
    },
  },
};

Mixins.CorpseDropper = {
  name: "CorpseDropper",
  init(template) {
    // Chance of dropping a cropse (out of 100)
    this._corpseDropRate = template["corpseDropRate"] || 100;
  },
  listeners: {
    onDeath(attacker) {
      // Check if we should drop a corpse.
      if (Math.round(Math.random() * 100) <= this._corpseDropRate) {
        // Create a new corpse item and drop it.
        this._map.addItem(
          this.getX(),
          this.getY(),
          this.getZ(),
          Game.Items.create("corpse", {
            name: this._name + " corpse",
            foreground: this._foreground,
          })
        );
      }
    },
  },
};

Mixins.Destructible = {
  name: "Destructible",
  getDefenseValue() {
    let modifier = 0;
    // If we can equip items, then check weapon / armor
    if (this.hasMixin(Game.Mixins.Equipper)) {
      if (this.getWeapon()) {
        modifier += this.getWeapon().getDefenseValue();
      }
      if (this.getArmor()) {
        modifier += this.getArmor().getDefenseValue();
      }
    }
    return this._defenseValue + modifier;
  },
  getHp() {
    return this._hp;
  },
  getMaxHp() {
    return this._maxHp;
  },
  increaseDefenseValue(value) {
    // If no value passed, default 2
    value = value || 2;
    // Add to the defense value
    this._defenseValue += value;
    Game.sendMessage(this, "You look tougher!");
  },
  increaseMaxHp(value) {
    // If no value passed, default 10
    value = value || 10;
    // Add to both max HP and HP
    this._maxHp += value;
    this._hp += value;
    Game.sendMessage(this, "You look healthier!");
  },
  init(template) {
    this._maxHp = template["maxHp"] || 10;
    // Allow health from template, incase entity needs different HP than max
    this._hp = template["hp"] || this._maxHp;
    this._defenseValue = template["defenseValue"] || 0;
  },
  listeners: {
    details() {
      return [
        { key: "defense", value: this.getDefenseValue() },
        { key: "hp", value: this.getHp() },
      ];
    },
    onGainLevel() {
      // Heal entity
      this.setHp(this.getMaxHp());
    },
  },
  setHp(hp) {
    this._hp = hp;
  },
  takeDamage(attacker, damage) {
    this._hp -= damage;
    // If 0 or less HP, then remove from  map
    if (this._hp <= 0) {
      Game.sendMessage(attacker, "You kill the %s!", [this.getName()]);
      // Raise events
      this.raiseEvent("onDeath", attacker);
      attacker.raiseEvent("onKill", this);
      this.kill();
    }
  },
};

// Edible mixins
Mixins.Edible = {
  name: "Edible",
  describe() {
    if (this._maxConsumptions !== this._remainingConsumptions) {
      return "partly eaten " + Game.Item.prototype.describe.call(this);
    } else {
      return this._name;
    }
  },
  eat(entity) {
    if (entity.hasMixin("FoodConsumer")) {
      if (this.hasRemainingConsumptions()) {
        entity.modifyFullnessBy(this._foodValue);
        this._remainingConsumptions--;
      }
    }
  },
  hasRemainingConsumptions() {
    return this._remainingConsumptions > 0;
  },
  init(template) {
    // Number of points added to hunger
    this._foodValue = template["foodValue"] || 5;
    // Number of times item can be consumed
    this._maxConsumptions = template["consumptions"] || 1;
    this._remainingConsumptions = this._maxConsumptions;
  },
  listeners: {
    details() {
      return [{ key: "food", value: this._foodValue }];
    },
  },
};

Mixins.Equippable = {
  name: "Equippable",
  getAttackValue() {
    return this._attackValue;
  },
  getDefenseValue() {
    return this._defenseValue;
  },
  init(template) {
    this._attackValue = template["attackValue"] || 0;
    this._defenseValue = template["defenseValue"] || 0;
    this._wieldable = template["wieldable"] || false;
    this._wearable = template["wearable"] || false;
  },
  isWearable() {
    return this._wearable;
  },
  isWieldable() {
    return this._wieldable;
  },
  listeners: {
    details() {
      let results = [];
      if (this._wieldable) {
        results.push({ key: "attack", value: this.getAttackValue() });
      }
      if (this._wearable) {
        results.push({ key: "defense", value: this.getDefenseValue() });
      }
      return results;
    },
  },
};

Mixins.Equipper = {
  name: "Equipper",
  init(template) {
    this._weapon = null;
    this._armor = null;
  },
  getArmor() {
    return this._armor;
  },
  getWeapon() {
    return this._weapon;
  },
  takeOff() {
    this._armor = null;
  },
  unequip(item) {
    // Helper function to be called before getting rid of an item.
    if (this._weapon === item) {
      this.unwield();
    }
    if (this._armor === item) {
      this.takeOff();
    }
  },
  unwield() {
    this._weapon = null;
  },
  wear(item) {
    this._armor = item;
  },
  wield(item) {
    this._weapon = item;
  },
};

Mixins.ExperienceGainer = {
  name: "ExperienceGainer",
  init(template) {
    this._level = template["level"] || 1;
    this._experience = template["experience"] || 0;
    this._statPointsPerLevel = template["statPointsPerLevel"] || 1;
    this._statPoints = 0;
    // Determine what stats can be levelled up.
    this._statOptions = [];
    if (this.hasMixin("Attacker")) {
      this._statOptions.push([
        "Increase attack value",
        this.increaseAttackValue,
      ]);
    }
    if (this.hasMixin("Destructible")) {
      this._statOptions.push([
        "Increase defense value",
        this.increaseDefenseValue,
      ]);
      this._statOptions.push(["Increase max health", this.increaseMaxHp]);
    }
    if (this.hasMixin("Sight")) {
      this._statOptions.push([
        "Increase sight range",
        this.increaseSightRadius,
      ]);
    }
  },
  getLevel() {
    return this._level;
  },
  getExperience() {
    return this._experience;
  },
  getNextLevelExperience() {
    return this._level * this._level * 10;
  },

  getStatOptions() {
    return this._statOptions;
  },
  getStatPoints() {
    return this._statPoints;
  },
  giveExperience(points) {
    // For future work
    // eslint-disable-next-line no-unused-vars
    let statPointsGained = 0;
    let levelsGained = 0;
    // Loop until we've allocated all points
    while (points > 0) {
      // Check if points will surpass the level
      if (this._experience + points >= this.getNextLevelExperience()) {
        // Fill experience till the next level
        let usedPoints = this.getNextLevelExperience() - this._experience;
        points -= usedPoints;
        this._experience += usedPoints;
        // Level entity
        this._level++;
        levelsGained++;
        this._statPoints += this._statPointsPerLevel;
        statPointsGained += this._statPointsPerLevel;
      } else {
        // Give the experience
        this._experience += points;
        points = 0;
      }
    }
    // Check if we gained at least one level
    if (levelsGained > 0) {
      Game.sendMessage(this, "You advance to level %d.", [this._level]);
      this.raiseEvent("onGainLevel");
    }
  },
  listeners: {
    details() {
      return [{ key: "level", value: this.getLevel() }];
    },
    onKill(victim) {
      let exp = victim.getMaxHp() + victim.getDefenseValue();
      if (victim.hasMixin("Attacker")) {
        exp += victim.getAttackValue();
      }
      // Account for level differences
      if (victim.hasMixin("ExperienceGainer")) {
        exp -= (this.getLevel() - victim.getLevel()) * 3;
      }
      // Only give experience if more than 0
      if (exp > 0) {
        this.giveExperience(exp);
      }
    },
  },
  setStatPoints(statPoints) {
    this._statPoints = statPoints;
  },
};

Mixins.FoodConsumer = {
  name: "FoodConsumer",
  addTurnHunger() {
    // Remove standard depletion points
    this.modifyFullnessBy(-this._fullnessDepletionRate);
  },
  getHungerState() {
    // Fullness points percent of max fullness
    let perPercent = this._maxFullness / 100;
    // 5% of max fullness or less = starving
    if (this._fullness <= perPercent * 5) {
      return "%c{#FF0039}Starving";
      // 25% of max fullness or less = hungry
    } else if (this._fullness <= perPercent * 25) {
      return "%c{#FC841F}Hungry";
      // 95% of max fullness or more = oversatiated
    } else if (this._fullness >= perPercent * 95) {
      return "%c{#59DE7E}Oversatiated";
      // 75% of max fullness or more = full
    } else if (this._fullness >= perPercent * 75) {
      return "%c{white}Full";
      // Anything else = not hungry
    } else {
      return "%c{#E4DA70}Not Hungry";
    }
  },
  init(template) {
    this._maxFullness = template["maxFullness"] || 1000;
    // Start halfway to max fullness if no default value
    this._fullness = template["fullness"] || this._maxFullness / 2;
    // Number of points to decrease fullness by every turn.
    this._fullnessDepletionRate = template["fullnessDepletionRate"] || 1;
  },
  modifyFullnessBy(points) {
    this._fullness = this._fullness + points;
    if (this._fullness <= 0) {
      this.kill("You have died of starvation!");
    } else if (this._fullness > this._maxFullness) {
      this.kill("You choke and die!");
    }
  },
};

Mixins.FungusActor = {
  name: "FungusActor",
  groupName: "Actor",
  act() {
    // Check if fungus tries growing this turn
    if (this._growthsRemaining > 0) {
      if (Math.random() <= 0.02) {
        // Generate coordinates of a random adjacent square by generating an offset between [-1, 0, 1] for both the x and y directions
        // To do this, generate a number from 0-2 and then subtract 1.
        let xOffset = Math.floor(Math.random() * 3) - 1;
        let yOffset = Math.floor(Math.random() * 3) - 1;
        // Make sure we aren't trying to spawn on the same tile as us
        if (xOffset !== 0 || yOffset !== 0) {
          // Check if fungus can spawn at location, if so grow
          if (
            this.getMap().isEmptyFloor(
              this.getX() + xOffset,
              this.getY() + yOffset,
              this.getZ()
            )
          ) {
            let entity = new Entity(EntityRepository._templates["fungus"]);
            entity.setPosition(
              this.getX() + xOffset,
              this.getY() + yOffset,
              this.getZ()
            );
            this.getMap().addEntity(entity);
            this._growthsRemaining--;
            // Send a message nearby!
            Game.sendMessageNearby(
              this.getMap(),
              entity.getX(),
              entity.getY(),
              entity.getZ(),
              "The fungus is spreading!"
            );
          }
        }
      }
    }
  },
  init() {
    this._growthsRemaining = 5;
  },
};

Mixins.GiantHorrorActor = {
  name: "GiantHorrorActor",
  grow() {
    this._hasGrown = true;
    this.increaseAttackValue(5);
    // Send a message saying horror grew stronger
    Game.sendMessageNearby(
      this.getMap(),
      this.getX(),
      this.getY(),
      this.getZ(),
      "The giant horror screams with rage!"
    );
  },
  listeners: {
    onDeath(attacker) {
      // Switch to win screen when killed!
      Game.switchScreen(Game.Screen.winScreen);
    },
  },
  spawn() {
    // Generate a random position nearby
    let xOffset = Math.floor(Math.random() * 3) - 1;
    let yOffset = Math.floor(Math.random() * 3) - 1;

    // Check if can spawn entity at position
    if (
      !this.getMap().isEmptyFloor(
        this.getX() + xOffset,
        this.getY() + yOffset,
        this.getZ()
      )
    ) {
      // If we cant, do nothing
      return;
    }
    // Create the entity
    let spawn = Game.Entities.create("slithering flesh");
    spawn.setX(this.getX() + xOffset);
    spawn.setY(this.getY() + yOffset);
    spawn.setZ(this.getZ());
    this.getMap().addEntity(spawn);
    Game.sendMessageNearby(
      this.getMap(),
      this.getX(),
      this.getY(),
      this.getZ(),
      "A piece of the giant horror falls off and begins to move!"
    );
  },
};

Mixins.InventoryHolder = {
  name: "InventoryHolder",
  addItem(item) {
    // Try to find slot, returns true if can slot the item
    for (let i = 0; i < this._items.length; i++) {
      if (!this._items[i]) {
        this._items[i] = item;
        return true;
      }
    }
    return false;
  },
  canAddItem() {
    // Check if empty slot
    for (let i = 0; i < this._items.length; i++) {
      if (!this._items[i]) {
        return true;
      }
    }
    return false;
  },
  getItem(i) {
    return this._items[i];
  },
  dropItem(i) {
    // Drops an item on current tile
    if (this._items[i]) {
      if (this._map) {
        this._map.addItem(
          this.getX(),
          this.getY(),
          this.getZ(),
          this._items[i]
        );
      }
      this.removeItem(i);
    }
  },
  getItems() {
    return this._items;
  },
  init(template) {
    // Default to 10 inventory slots
    let inventorySlots = template["inventorySlots"] || 10;
    // Set up empty inventory
    this._items = new Array(inventorySlots);
  },
  pickupItems(indices) {
    // Allow user to pick up items on the map, indices is the indices for array returned by map.getItemsAt
    let mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
    let added = 0;
    // Iterate through indices
    for (let i = 0; i < indices.length; i++) {
      // Try to add the item, if our inventory is not full, splice item out of list
      if (this.addItem(mapItems[indices[i] - added])) {
        mapItems.splice(indices[i] - added, 1);
        added++;
      } else {
        // Inventory full
        break;
      }
    }
    // Update map items
    this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
    // Return true only if we added all items
    return added === indices.length;
  },
  removeItem(i) {
    // If can equip items, unequip item removed
    if (this._items[i] && this.hasMixin(Game.Mixins.Equipper)) {
      this.unequip(this._items[i]);
    }
    // Clear inventory slot
    this._items[i] = null;
  },
};

Mixins.MessageRecipient = {
  name: "MessageRecipient",
  clearMessages() {
    this._messages = [];
  },
  getMessages() {
    return this._messages;
  },
  init(template) {
    this._messages = [];
  },
  receiveMessage(message) {
    this._messages.push(message);
  },
};

Mixins.PlayerActor = {
  name: "PlayerActor",
  groupName: "Actor",
  act() {
    if (this._acting) {
      return;
    }
    this._acting = true;
    this.addTurnHunger();
    // Detect if the game is over
    if (!this.isAlive()) {
      Game.Screen.playScreen.setGameEnded(true);
      // Send a last message to the player
      Game.sendMessage(this, "Press [Enter] to continue!");
    }
    // Re-render the screen
    Game.refresh();
    // Lock the engine and wait asynchronously for the player to press a key
    this.getMap().getEngine().lock();
    // Clear the message queue
    this.clearMessages();
    this._acting = false;
  },
};

Mixins.PlayerStatGainer = {
  name: "PlayerStatGainer",
  groupName: "StatGainer",
  listeners: {
    onGainLevel() {
      // Setup the gain stat screen and show it
      Game.Screen.gainStatScreen.setup(this);
      Game.Screen.playScreen.setSubScreen(Game.Screen.gainStatScreen);
    },
  },
};

Mixins.RandomStatGainer = {
  name: "RandomStatGainer",
  groupName: "StatGainer",
  listeners: {
    onGainLevel() {
      let statOptions = this.getStatOptions();
      // Randomly select stat option and execute callback for each point
      while (this.getStatPoints() > 0) {
        // Call the stat increasing function with this as the context
        Game.randomize(statOptions)[0][1].call(this);
        this.setStatPoints(this.getStatPoints() - 1);
      }
    },
  },
};

// Signifies entity posseses FOV
Mixins.Sight = {
  name: "Sight",
  groupName: "Sight",
  canSee(entity) {
    // If not on same map or different floor, exit
    if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {
      return false;
    }

    let otherX = entity.getX();
    let otherY = entity.getY();

    // If not in square FOV, then won't be in a real FOV either
    if (
      (otherX - this._x) * (otherX - this._x) +
        (otherY - this._y) * (otherY - this._y) >
      this._sightRadius * this._sightRadius
    ) {
      return false;
    }

    // Compute the FOV and check if the coordinates are there
    let found = false;
    this.getMap()
      .getFov(this.getZ())
      .compute(this.getX(), this.getY(), this.getSightRadius(), function (
        x,
        y,
        radius,
        visibility
      ) {
        if (x === otherX && y === otherY) {
          found = true;
        }
      });
    return found;
  },
  getSightRadius() {
    return this._sightRadius;
  },
  increaseSightRadius(value) {
    // If no value was passed, default 1.
    value = value || 1;
    // Add to sight radius
    this._sightRadius += value;
    Game.sendMessage(this, "You are more aware of your surroundings!");
  },
  init(template) {
    this._sightRadius = template["sightRadius"] || 5;
  },
};

Mixins.TaskActor = {
  name: "TaskActor",
  groupName: "Actor",
  act() {
    // Iterate through all our tasks
    for (let i = 0; i < this._tasks.length; i++) {
      if (this.canDoTask(this._tasks[i])) {
        // If can perform task, execute
        this[this._tasks[i]]();
        return;
      }
    }
  },
  canDoTask(task) {
    if (task === "grow") {
      return this.getHp() <= 15 && !this._hasGrown;
      // Spawn 5% of turns
    } else if (task === "spawn") {
      return Math.round(Math.random() * 100) <= 5;
    } else if (task === "hunt") {
      return this.hasMixin("Sight") && this.canSee(this.getMap().getPlayer());
    } else if (task === "wander") {
      return true;
    } else {
      throw new Error("Tried to perform undefined task " + task);
    }
  },
  hunt() {
    let player = this.getMap().getPlayer();
    // If adjacent to player, attack instead hunt
    let offsets =
      Math.abs(player.getX() - this.getX()) +
      Math.abs(player.getY() - this.getY());
    if (offsets === 1) {
      if (this.hasMixin("Attacker")) {
        this.attack(player);
        return;
      }
    }
    // Generate path and move to first tile
    let source = this;
    let z = source.getZ();
    let path = new ROT.Path.AStar(
      player.getX(),
      player.getY(),
      function (x, y) {
        // If entity present, can't move
        let entity = source.getMap().getEntityAt(x, y, z);
        if (entity && entity !== player && entity !== source) {
          return false;
        }
        return source.getMap().getTile(x, y, z).isWalkable();
      },
      { topology: 4 }
    );
    // Move to the second cell passed in the callback (entity's strting point)
    let count = 0;
    path.compute(source.getX(), source.getY(), function (x, y) {
      if (count === 1) {
        source.tryMove(x, y, z);
      }
      count++;
    });
  },
  init(template) {
    // Load tasks
    this._tasks = template["tasks"] || ["wander"];
  },
  wander() {
    // Flip coin to determine if moving by 1 in the positive or negative direction
    let moveOffset = Math.round(Math.random()) === 1 ? 1 : -1;
    // Flip coin to determine if moving in x direction or y direction
    if (Math.round(Math.random()) === 1) {
      this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
    } else {
      this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());
    }
  },
};

export default Mixins;
