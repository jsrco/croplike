import Cave from "./maps/Cave";
import Game from "./Game";
import SprintF from "sprintf-js";

class ItemListScreen {
  constructor(template) {
    // Set up based on template
    this._caption = template["caption"];
    this._okFunction = template["ok"];
    // By default, we use the identity function
    this._isAcceptableFunction =
      template["isAcceptable"] ||
      function (x) {
        return x;
      };
    // If user can select items
    this._canSelectItem = template["canSelect"];
    // If user can select multiple items
    this._canSelectMultipleItems = template["canSelectMultipleItems"];
    // Whether a 'no item' option should appear.
    this._hasNoItemOption = template["hasNoItemOption"];
  }
  executeOkFunction() {
    // Gather selected items
    let selectedItems = {};
    for (let key in this._selectedIndices) {
      selectedItems[key] = this._items[key];
    }
    // Switch back to the play screen
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call OK function and end the player turn if it return true
    if (this._okFunction(selectedItems)) {
      this._player.getMap().getEngine().unlock();
    }
  }
  handleInput(inputType, inputData) {
    if (inputType === "keydown") {
      // If user hit escape, enter, can't select item, or no item selected, cancel out
      if (
        inputData.key === "Escape" ||
        (inputData.key === "Enter" &&
          (!this._canSelectItem ||
            Object.keys(this._selectedIndices).length === 0))
      ) {
        Game.Screen.playScreen.setSubScreen(undefined);
        // Handle pressing return when items are selected
      } else if (inputData.key === "Enter") {
        this.executeOkFunction();
        // Handle pressing a letter if we can select
      } else if (inputData.key === "Enter") {
        this.executeOkFunction();
        // Handle pressing zero when 'no item' selection is enabled
      } else if (
        this._canSelectItem &&
        this._hasNoItemOption &&
        inputData.key === "0"
      ) {
        this._selectedIndices = {};
        this.executeOkFunction();
        // Handle pressing a letter if we can select
      } else if (
        this._canSelectItem &&
        inputData.keyCode >= 65 &&
        inputData.keyCode <= 90
      ) {
        // Check if maps to valid item by subtracting 'a' from character to know what letter of alphabet used
        let index = inputData.keyCode - 65;
        if (this._items[index]) {
          // If multiple selection is allowed, toggle selection status, else select item and exit
          if (this._canSelectMultipleItems) {
            if (this._selectedIndices[index]) {
              delete this._selectedIndices[index];
            } else {
              this._selectedIndices[index] = true;
            }
            // Redraw screen
            Game.refresh();
          } else {
            this._selectedIndices[index] = true;
            this.executeOkFunction();
          }
        }
      }
    }
  }
  render(display) {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    // Render the caption in the top row
    display.drawText(0, 0, this._caption);
    // Render the no item row if enabled
    if (this._hasNoItemOption) {
      display.drawText(0, 1, "0 - no item");
    }
    let row = 0;
    for (let i = 0; i < this._items.length; i++) {
      // If item, render
      if (this._items[i]) {
        // Get letter matching index
        let letter = letters.substring(i, i + 1);
        // If selected item, show +, else show -
        let selectionState =
          this._canSelectItem &&
          this._canSelectMultipleItems &&
          this._selectedIndices[i]
            ? "+"
            : "-";
        // Check if worn / wielded
        let suffix = "";
        if (this._items[i] === this._player.getArmor()) {
          suffix = " (wearing)";
        } else if (this._items[i] === this._player.getWeapon()) {
          suffix = " (wielding)";
        }
        // Render  correct row, add 2.
        display.drawText(
          0,
          2 + row,
          letter +
            " " +
            selectionState +
            " " +
            this._items[i].describe() +
            suffix
        );
        row++;
      }
    }
  }
  setup(player, items) {
    this._player = player;
    // Should be called before switching to the screen.
    let count = 0;
    // Keep only aceptable items and count
    let that = this;
    this._items = items.map((item) => {
      // Transform the item into null if not acceptable
      if (that._isAcceptableFunction(item)) {
        count++;
        return item;
      } else {
        return null;
      }
    });
    // Clean set of selected indices
    this._selectedIndices = {};
    return count;
  }
}

class TargetBasedScreen {
constructor (template) {
  template = template || {};
  // By default, our ok return does nothing and does not consume a turn.
  this._isAcceptableFunction = template['okFunction'] || function(x, y) {
      return false;
  };
  // The defaut caption function simply returns an empty string.
  this._captionFunction = template['captionFunction'] || function(x, y) {
      return '';
  }
}
executeOkFunction() {
  // Switch back to the play screen
  Screen.playScreen.setSubScreen(undefined);
  // This is a problem for future Fat Thunder. Disable screen.,
  /*
  if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
      this._player.getMap().getEngine().unlock();
  }
  */
}
handleInput (inputType, inputData) {
  // Move the cursor
  if (inputType === 'keydown') {
      if (inputData.key === "ArrowLeft") {
          this.moveCursor(-1, 0);
      } else if (inputData.key === "ArrowRight") {
          this.moveCursor(1, 0);
      } else if (inputData.key === "ArrowUp") {
          this.moveCursor(0, -1);
      } else if (inputData.key === "ArrowDown") {
          this.moveCursor(0, 1);
      } else if (inputData.keyCode === 36) {
        this.moveCursor(-1, -1); // nw
      } else if (inputData.keyCode === 33) {
        this.moveCursor(1, -1); // ne
      } else if (inputData.keyCode === 34) {
        this.moveCursor(1, 1); // se
      } else if (inputData.keyCode === 35) {
        this.moveCursor(-1, 1); // sw
      }  else if (inputData.key === "Escape") {
          Game.Screen.playScreen.setSubScreen(undefined);
      } else if (inputData.key === "Enter") {
          this.executeOkFunction();
      }
  }
  Game.refresh();
}
moveCursor(dx, dy) {
  // Make sure we stay within bounds
  this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
  // We have to save the last line for the caption
  this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
}
render(display) {
  Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);

  // Draw a line from the start to the cursor
  let points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
      this._cursorY);

  // Render stars along the line
  for (let i = 0, l = points.length; i < l; i++) {
      display.drawText(points[i].x, points[i].y, '%c{white}*');
  }
  // Render the caption at the bottom
  display.drawText(0, Game.getScreenHeight() - 6, 
      this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};
setup(player, startX, startY, offsetX, offsetY) {
  this._player = player;
  // Store original position, subtract the offset so don't always have to remove it
  this._startX = startX - offsetX;
  this._startY = startY - offsetY;
  // Store current cursor position
  this._cursorX = this._startX;
  this._cursorY = this._startY;
  // Store map offsets
  this._offsetX = offsetX;
  this._offsetY = offsetY;
  // Cache the FOV
  let visibleCells = {};
  this._player.getMap().getFov(this._player.getZ()).compute(
      this._player.getX(), this._player.getY(), 
      this._player.getSightRadius(), 
      function(x, y, radius, visibility) {
          visibleCells[x + "," + y] = true;
      });
  this._visibleCells = visibleCells;
}
}

let Screen = {};

Screen.dropScreen = new ItemListScreen({
  canSelect: true,
  canSelectMultipleItems: false,
  caption: "Choose the item you wish to drop",
  ok(selectedItems) {
    // Drop the selected item
    this._player.dropItem(Object.keys(selectedItems)[0]);
    return true;
  },
});

Screen.eatScreen = new ItemListScreen({
  canSelect: true,
  canSelectMultipleItems: false,
  caption: "Choose the item you wish to eat",
  isAcceptable(item) {
    return item && item.hasMixin("Edible");
  },
  ok(selectedItems) {
    // Eat the item, removing it if no consumptions.
    let key = Object.keys(selectedItems)[0];
    let item = selectedItems[key];
    Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
    item.eat(this._player);
    if (!item.hasRemainingConsumptions()) {
      this._player.removeItem(key);
    }
    return true;
  },
});

Screen.examineScreen = new ItemListScreen({
  caption: "Choose the item you wish to examine",
  canSelect: true,
  canSelectMultipleItems: false,
  isAcceptable(item) {
    return true;
  },
  ok(selectedItems) {
    let keys = Object.keys(selectedItems);
    if (keys.length > 0) {
      let item = selectedItems[keys[0]];
      Game.sendMessage(this._player, "It's %s (%s).", [
        item.describeA(false),
        item.details(),
      ]);
    }
    return true;
  },
});

Screen.gainStatScreen = {
  handleInput(inputType, inputData) {
    if (inputType === "keydown") {
      // If letter, check if matches to valid option
      if (inputData.keyCode >= 65 && inputData.keyCode <= 90) {
        // Check if valid item by subtracting 'a' from the character to know letter of alphabet used
        let index = inputData.keyCode - 65;
        if (this._options[index]) {
          // Call stat increasing
          this._options[index][1].call(this._entity);
          // Decrease stats
          this._entity.setStatPoints(this._entity.getStatPoints() - 1);
          // If no stats, exit screen/ else refresh
          if (this._entity.getStatPoints() === 0) {
            Game.Screen.playScreen.setSubScreen(undefined);
          } else {
            Game.refresh();
          }
        }
      }
    }
  },
  render(display) {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    display.drawText(0, 0, "Choose a stat to increase: ");

    // Iterate through each option
    for (let i = 0; i < this._options.length; i++) {
      display.drawText(
        0,
        2 + i,
        letters.substring(i, i + 1) + " - " + this._options[i][0]
      );
    }

    // Render remaining stats
    display.drawText(
      0,
      4 + this._options.length,
      "Remaining points: " + this._entity.getStatPoints()
    );
  },
  setup(entity) {
    // Must be called before rendering.
    this._entity = entity;
    this._options = entity.getStatOptions();
  },
};

Screen.helpScreen = {
  handleInput(inputType, inputData) {
      Screen.playScreen.setSubScreen(null);
  },
  render(display) {
      let y = 0;
      display.drawText(0, y++, '%c{indigo}Indigo Abyss %c{#FC841F}Help');
      display.drawText(0, y++, '%c{white}-----------------');
      y += 1;
      display.drawText(0, y++, '%c{white}It was your time to be lowered down.');
      y += 1;
      display.drawText(0, y++, '%c{white}There is no return.');
      y += 3;
      display.drawText(0, y++, '%c{white}Use the numpad to move.');
      display.drawText(0, y++, '[%c{#FC841F}g%c{white}] to pick up items');
      display.drawText(0, y++, '[%c{#FC841F}d%c{white}] to drop items');
      display.drawText(0, y++, '[%c{#FC841F}e%c{white}] to eat items');
      display.drawText(0, y++, '[%c{#FC841F}w%c{white}] to wield items');
      display.drawText(0, y++, '[%c{#FC841F}shift %c{white}+ %c{#FC841F}w%c{white}] to wear items');
      display.drawText(0, y++, '[%c{#FC841F}i%c{white}] to examine inventory');
      display.drawText(0, y++, '[%c{#FC841F}l%c{white}] to look around you');
      display.drawText(0, y++, '[%c{#FC841F}>%c{white}] to go down');
      display.drawText(0, y++, '[%c{#FC841F}<%c{white}] to go up');
      display.drawText(0, y++, '[%c{#FC841F}?%c{white}] to show this help screen');
      y += 3;
      display.drawText(0, y++, '%c{white}- press %c{#FC841F}any%c{white} key to continue -');
  }
}

Screen.inventoryScreen = new ItemListScreen({
  canSelect: false,
  caption: "Inventory",
});

Screen.lookScreen = new TargetBasedScreen({
  captionFunction(x, y) {
      let z = this._player.getZ();
      let map = this._player.getMap();
      // If the tile is explored, we can give a better capton
      if (map.isExplored(x, y, z)) {
          // If tile is unexplored, check if can see before testing for entity or item
          if (this._visibleCells[x + ',' + y]) {
              let items = map.getItemsAt(x, y, z);
              // If we have items, we want to render the top most item
              if (items) {
                  let item = items[items.length - 1];
                  return SprintF.vsprintf('%s - %s (%s)',[
                      item.getRepresentation(),
                      item.describeA(true),
                      item.details()]);
              // Else check if there's an entity
              } else if (map.getEntityAt(x, y, z)) {
                  let entity = map.getEntityAt(x, y, z);
                  return SprintF.vsprintf('%s - %s (%s)',[
                      entity.getRepresentation(),
                      entity.describeA(true),
                      entity.details()]);
              }
          }
          // If there was no entity/item or the tile wasn't visible, then use tile information
          return SprintF.vsprintf('%s - %s',[
              map.getTile(x, y, z).getRepresentation(),
              map.getTile(x, y, z).getDescription()]);
      } else {
          // If the tile is not explored, show the null tile description
          return SprintF.vsprintf('%s - %s',[
              Game.Tile.nullTile.getRepresentation(),
              Game.Tile.nullTile.getDescription()]);
      }
  }
});

// Define winning screen
Screen.loseScreen = {
  enter() {},
  exit() {},
  handleInput(inputType, inputData) {
    // Nothing to do here
  },
  render(display) {
    // Render our prompt to the screen
    display.drawText(2, 3, "%c{#4B0082}You have joined the flesh.");
  },
};

Screen.pickupScreen = new ItemListScreen({
  canSelect: true,
  canSelectMultipleItems: true,
  caption: "Choose the items you wish to pickup",
  ok(selectedItems) {
    // Try to pick up all items, message player if can't
    if (!this._player.pickupItems(Object.keys(selectedItems))) {
      Game.sendMessage(
        this._player,
        "Your inventory is full! Not all items were picked up."
      );
    }
    return true;
  },
});

// Define our playing screen
Screen.playScreen = {
  _gameEnded: false,
  _player: null,
  _subScreen: null,
  enter() {
    // Map size parameters
    let width = 78;
    let height = 48;
    let depth = 6;
    // Create map from tiles and player
    this._player = new Game.Entity(Game.Player);
    let tiles = new Game.Builder(width, height, depth).getTiles();
    let map = new Cave(tiles, this._player);
    // Start the map's engine
    map.getEngine().start();
  },
  exit() {},
  getScreenOffsets() {
    // Make sure there is still enough space to fit game screen
    let topLeftX = Math.max(0, this._player.getX() - Game.getScreenWidth() / 2);
    // Make sure there is enough space to fit game screen
    topLeftX = Math.min(
      topLeftX,
      this._player.getMap().getWidth() - Game.getScreenWidth()
    );
    // Make sure the y-axis doesn't above the top bound
    let topLeftY = Math.max(
      0,
      this._player.getY() - Game.getScreenHeight() / 2
    );
    // Make sure we still have enough space to fit an entire game screen
    topLeftY = Math.min(
      topLeftY,
      this._player.getMap().getHeight() - Game.getScreenHeight()
    );
    return {
      x: topLeftX,
      y: topLeftY,
    };
  },
  handleInput(inputType, inputData) {
    // If the game is over, enter will bring the user to the losing screen.
    if (this._gameEnded) {
      if (inputData.key === "Enter") {
        Game.switchScreen(Game.Screen.loseScreen);
      }
      // Return to make sure the user can't still play
      return;
    }
    // Handle subscreen input if there is one
    if (this._subScreen) {
      this._subScreen.handleInput(inputType, inputData);
      return;
    }
    if (inputType === "keydown") {
      // Movement
      if (inputData.key === "ArrowLeft") {
        this.move(-1, 0, 0);
      } else if (inputData.key === "ArrowRight") {
        this.move(1, 0, 0);
      } else if (inputData.key === "ArrowUp") {
        this.move(0, -1, 0);
      } else if (inputData.key === "ArrowDown") {
        this.move(0, 1, 0);
      } else if (inputData.keyCode === 36) {
        this.move(-1, -1, 0); // nw
      } else if (inputData.keyCode === 33) {
        this.move(1, -1, 0); // ne
      } else if (inputData.keyCode === 34) {
        this.move(1, 1, 0); // se
      } else if (inputData.keyCode === 35) {
        this.move(-1, 1, 0); // sw
      } else if (inputData.keyCode === 12) {
        this.move(0, 0, 0); // wait
      } else if (inputData.key === ".") {
        this.move(0, 0, 1);
      } else if (inputData.key === ",") {
        this.move(0, 0, -1);
      } else if (inputData.key === "l") {
        // Setup the look screen
        let offsets = this.getScreenOffsets();
        Screen.lookScreen.setup(this._player,
            this._player.getX(), this._player.getY(),
            offsets.x, offsets.y);
        this.setSubScreen(Screen.lookScreen);
        return;
    } else if (inputData.key === "/") {
        // Setup the help screen
        this.setSubScreen(Screen.helpScreen);
    } else if (inputData.key === "i") {
        // Show the drop screen
        this.showItemsSubScreen(
          Screen.examineScreen,
          this._player.getItems(),
          "You have nothing to examine."
        );
        return;
      } else if (inputData.key === "d") {
        // Show the drop screen
        if (
          Screen.dropScreen.setup(this._player, this._player.getItems())
        ) {
          this.setSubScreen(Screen.dropScreen);
        } else {
          Game.sendMessage(this._player, "You have nothing to drop!");
          Game.refresh();
        }
        return;
      } else if (inputData.key === "e") {
        // Show eat screen
        if (
          Game.Screen.eatScreen.setup(this._player, this._player.getItems())
        ) {
          this.setSubScreen(Game.Screen.eatScreen);
        } else {
          Game.sendMessage(this._player, "You have nothing to eat!");
          Game.refresh();
        }
        return;
      } else if (inputData.key === "w") {
        // Show wield screen
        this.showItemsSubScreen(
          Game.Screen.wieldScreen,
          this._player.getItems(),
          "You have nothing to wield."
        );
        return;
      } else if (inputData.key === "W") {
        // Show wear screen
        this.showItemsSubScreen(
          Game.Screen.wearScreen,
          this._player.getItems(),
          "You have nothing to wear."
        );
      } else if (inputData.key === "g") {
        let items = this._player
          .getMap()
          .getItemsAt(
            this._player.getX(),
            this._player.getY(),
            this._player.getZ()
          );
        // If there are no items, show a message
        if (!items) {
          Game.sendMessage(this._player, "There is nothing here to pick up.");
        } else if (items.length === 1) {
          // If only one item, try to pick it up
          let item = items[0];
          if (this._player.pickupItems([0])) {
            Game.sendMessage(this._player, "You pick up %s.", [
              item.describeA(),
            ]);
          } else {
            Game.sendMessage(
              this._player,
              "Your inventory is full! Nothing was picked up."
            );
          }
        } else {
          // Show the pickup screen if there are any items
          Game.Screen.pickupScreen.setup(this._player, items);
          this.setSubScreen(Game.Screen.pickupScreen);
          return;
        }
      } else {
        // Not a valid key
        return;
      }
      // Unlock the engine
      this._player.getMap().getEngine().unlock();
    }
  },
  move(dX, dY, dZ) {
    let newX = this._player.getX() + dX;
    let newY = this._player.getY() + dY;
    let newZ = this._player.getZ() + dZ;
    // Try to move to the new cell
    this._player.tryMove(newX, newY, newZ, this._player.getMap());
  },
  render(display) {
    // Render subscreen if there is one
    if (this._subScreen) {
      this._subScreen.render(display);
      return;
    }
    let screenWidth = Game.getScreenWidth();
    let screenHeight = Game.getScreenHeight();

    // Render the tiles
    this.renderTiles(display);
    // Get the messages in the player's queue and render them
    let messages = this._player.getMessages();
    let messageY = 0;
    for (let i = 0; i < messages.length; i++) {
      // Draw each message, adding the number of lines
      messageY += display.drawText(
        0,
        messageY,
        "%c{black}%b{white}" + messages[i]
      );
    }
    // Render player stats
    let stats = "%c{white}%b{black}";
    stats += SprintF.vsprintf("HP: %d/%d Lvl: %d XP: %d", [
      this._player.getHp(),
      this._player.getMaxHp(),
      this._player.getLevel(),
      this._player.getExperience(),
    ]);
    display.drawText(0, screenHeight, stats);
    // Render hunger state
    let hungerState = this._player.getHungerState();
    display.drawText(
      screenWidth - hungerState.length,
      screenHeight,
      hungerState
    );
  },
  renderTiles(display) {
    let screenWidth = Game.getScreenWidth();
    let screenHeight = Game.getScreenHeight();
    let offsets = this.getScreenOffsets();
    let topLeftX = offsets.x;
    let topLeftY = offsets.y;
    // This object will keep track of all visible map cells
    let visibleCells = {};
    // Store this._player.getMap() and player's z to prevent losing it in callbacks
    let map = this._player.getMap();
    let currentDepth = this._player.getZ();
    // Find all visible cells and update the object
    map
      .getFov(currentDepth)
      .compute(
        this._player.getX(),
        this._player.getY(),
        this._player.getSightRadius(),
        (x, y, radius, visibility) => {
          visibleCells[x + "," + y] = true;
          // Mark cell as explored
          map.setExplored(x, y, currentDepth, true);
        }
      );

    // Render the explored map cells
    for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
      for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
        if (map.isExplored(x, y, currentDepth)) {
          // Fetch glyph for tile, render it to the screen at offset
          let glyph = this._player.getMap().getTile(x, y, currentDepth);
          let foreground = glyph.getForeground();
          // If cell in FOV, check if items / entities.
          if (visibleCells[x + "," + y]) {
            // Check for items first, entities drawn over items.
            let items = map.getItemsAt(x, y, currentDepth);
            // If item, render top most item
            if (items) {
              glyph = items[items.length - 1];
            }
            // Check for entity
            if (map.getEntityAt(x, y, currentDepth)) {
              glyph = map.getEntityAt(x, y, currentDepth);
            }
            // Update foreground color
            foreground = glyph.getForeground();
          } else {
            // Explored but is not visible, change foreground to dark gray.
            foreground = "#2B192E";
          }
          display.draw(
            x - topLeftX,
            y - topLeftY,
            glyph.getChar(),
            foreground,
            glyph.getBackground()
          );
        }
      }
    }
  },
  setGameEnded(gameEnded) {
    this._gameEnded = gameEnded;
  },
  setSubScreen(subScreen) {
    this._subScreen = subScreen;
    // Refresh screen on changing subscreen
    Game.refresh();
  },
  showItemsSubScreen(subScreen, items, emptyMessage) {
    if (items && subScreen.setup(this._player, items) > 0) {
      this.setSubScreen(subScreen);
    } else {
      Game.sendMessage(this._player, emptyMessage);
      Game.refresh();
    }
  },
};

// Define our initial start screen
Screen.startScreen = {
  enter() {},
  exit() {},
  handleInput(inputType, inputData) {
    // When [Enter] is pressed, go to the play screen
    if (inputType === "keydown") {
      if (inputData.key === "Enter") {
        Game.switchScreen(Screen.playScreen);
      }
    }
  },
  render(display) {
    // Render our prompt to the screen
    display.drawText(
      1,
      1,
      "%c{#FC841F}project orange%c{white}: %c{#4B0082}Indigo Abyss %c{#FC841F}(WIP)"
    );
    display.drawText(
      1,
      3,
      "%c{white}Press [%c{#FC841F}Enter%c{white}] to start!"
    );
    display.drawText(
      1,
      4,
      "%c{white}Press [%c{#FC841F}?%c{white}] for help / info!"
    );
    display.drawText(1, 6, "%c{white}A keyboard is required.");
    display.drawText(1, 8, "%c{white}Mouse and touch support in development.");
  },
};

Screen.wearScreen = new ItemListScreen({
  canSelect: true,
  canSelectMultipleItems: false,
  caption: "Choose the item you wish to wear",
  hasNoItemOption: true,
  isAcceptable(item) {
    return item && item.hasMixin("Equippable") && item.isWearable();
  },
  ok(selectedItems) {
    // Check if 'no item'
    let keys = Object.keys(selectedItems);
    if (keys.length === 0) {
      this._player.unwield();
      Game.sendMessage(this._player, "You are not wearing anthing.");
    } else {
      // Unequip item first
      let item = selectedItems[keys[0]];
      this._player.unequip(item);
      this._player.wear(item);
      Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
    }
    return true;
  },
});

Screen.wieldScreen = new ItemListScreen({
  canSelect: true,
  canSelectMultipleItems: false,
  caption: "Choose the item you wish to wield",
  hasNoItemOption: true,
  isAcceptable(item) {
    return item && item.hasMixin("Equippable") && item.isWieldable();
  },
  ok(selectedItems) {
    // Check if 'no item'
    let keys = Object.keys(selectedItems);
    if (keys.length === 0) {
      this._player.unwield();
      Game.sendMessage(this._player, "You are empty handed.");
    } else {
      // Unequip item first
      let item = selectedItems[keys[0]];
      this._player.unequip(item);
      this._player.wield(item);
      Game.sendMessage(this._player, "You are wielding %s.", [
        item.describeA(),
      ]);
    }
    return true;
  },
});

// Define our winning screen
Screen.winScreen = {
  enter() {},
  exit() {},

  handleInput(inputType, inputData) {
    // Nothing to do here
  },
  render(display) {
    // Render our prompt to the screen
    display.drawText(2, 3, "%c{#4B0082}You have stalled the flesh.");
  },
};

export default Screen;
