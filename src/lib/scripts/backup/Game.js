import Builder from "./Builder";
import Entity from "./Entity";
import { EntityRepository, Player } from "./Entities";
import Geometry from "./Geometry";
import Item from "./Item";
import { ItemRepository } from "./Item";
import Map from "./maps/Maps";
import Mixins from "./mixins/Mixins";
import Screen from "./Screen";
import SprintF from "sprintf-js";
import Tile from "./Tile";

let ROT = require("rot-js");
let Game = {
  _display: null,
  _currentScreen: null,
  _screenWidth: 50,
  _screenHeight: 24,
  Builder: Builder,
  Entities: EntityRepository,
  Entity: Entity,
  Geometry: new Geometry(),
  Item: Item,
  Items: ItemRepository,
  Map: Map,
  Mixins: Mixins,
  Player: Player,
  Screen: Screen,
  Tile: Tile,
  init() {
    // Any necessary initialization will go here.
    this._display = new ROT.Display({
      fontFamily: "'Press Start 2p', cursive",
      fontSize: 15,
      forceSquareRatio: true,
      height: this._screenHeight + 1,
      width: this._screenWidth,
    });
    // Create a helper function for binding to an event and making it send it to the screen
    let game = this; // So that the Game don't lose this
    let bindEventToScreen = (event) => {
      window.addEventListener(event, (e) => {
        // When an event is received, send it to the screen if there is one
        if (game._currentScreen !== null) {
          // Send the event type and data to the screen
          game._currentScreen.handleInput(event, e);
        }
      });
    };
    // Bind keyboard input events
    bindEventToScreen("keydown");
    //bindEventToScreen('keyup');
    //bindEventToScreen('keypress');

    // Mount display to the DOM
    this.mountDisplay();
  },
  getDisplay() {
    return this._display;
  },
  getNeighborPositions(x, y) {
    let tiles = [];
    // Generate all possible offsets
    for (let dX = -1; dX < 2; dX++) {
      for (let dY = -1; dY < 2; dY++) {
        // Make sure it isn't the same tile
        if (dX === 0 && dY === 0) {
          continue;
        }
        tiles.push({ x: x + dX, y: y + dY });
      }
    }
    return this.randomize(tiles);
  },
  getScreenHeight() {
    return this._screenHeight;
  },
  getScreenWidth() {
    return this._screenWidth;
  },
  mountDisplay() {
    document
      .getElementById("displays")
      .appendChild(this._display.getContainer());
  },
  // When in doubt, make your own randomizer
  randomize(arr) {
    let t,
      j,
      ret = arr.slice(0),
      i = ret.length;
    while (--i > 0) {
      t = ret[(j = Math.round(Math.random() * i))];
      ret[j] = ret[i];
      ret[i] = t;
    }
    return ret;
  },
  refresh() {
    // Clear the screen
    this._display.clear();
    // Render the screen
    this._currentScreen.render(this._display);
  },
  sendMessage(recipient, message, args) {
    // Make sure recipient can receive message
    if (recipient.hasMixin(this.Mixins.MessageRecipient)) {
      // If args were passed, then format message, else none
      if (args) {
        message = SprintF.vsprintf(message, args);
      }
      recipient.receiveMessage(message);
    }
  },
  sendMessageNearby(map, centerX, centerY, centerZ, message, args) {
    // If args were passed, then format message, else none
    if (args) {
      message = SprintF.vsprintf(message, args);
    }
    // Get the nearby entities
    let entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);
    // Iterate through nearby entities, send message if recipient
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
        entities[i].receiveMessage(message);
      }
    }
  },
  switchScreen(screen) {
    // If there is a screen before, notify it that we exited
    if (this._currentScreen !== null) {
      this._currentScreen.exit();
    }
    // Clear the display
    this.getDisplay().clear();
    // Update current screen, notify it that we entered, and then render
    this._currentScreen = screen;
    if (!this._currentScreen !== null) {
      this._currentScreen.enter();
      this.refresh();
    }
  },
};
/**
 * Entities either exist or don't.
 * Driven by needs.
 * Needs give access to actions.
 * If an entity has a need, it has access to diffrent actions associated with that need.
 * All needs and actions are component based.
 * All components must be toggable in the engine.
 * If removed the entire game continues to funtion.
 * Pathfinding based of needs.
 * Action's are local and based of grid context.
 * The player acts faster than entities.
 * For a start. Have herbivores. That graze on fungus that grows in a cave.
 * They only become hostile if their hunger is at 0 and no fungus in site.
 * If the entity has access to the smell action, they can smell up to N tiles outside of their fov.
 * Anything that modifies an actions or need with is stats or physics is a mod.
 * Mods are for buff, debuffs, equipments, genetics etc.
 * They affect actions.
 */

export default Game;
