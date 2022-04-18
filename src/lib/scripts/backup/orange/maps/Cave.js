import Game from "../Game";
import Map from "./Maps";

class Cave extends Map{
  constructor(tiles, player) {
    super(tiles);
    // Add the player
    this.addEntityAtRandomPosition(player, 0);
    // Add random entities items to each floor
    for (let z = 0; z < this._depth; z++) {
      // 25 entities per floor
      for (let i = 0; i < 25; i++) {
        let entity = Game.Entities.createRandom();
        // Add a random entity
        this.addEntityAtRandomPosition(entity, z);
        // Level up the entity based on the floor
        if (entity.hasMixin("ExperienceGainer")) {
          for (let level = 0; level < z; level++) {
            entity.giveExperience(
              entity.getNextLevelExperience() - entity.getExperience()
            );
          }
        }
      }
      // 15 items per floor
      for (let i = 0; i < 15; i++) {
        // Add a random entity
        this.addItemAtRandomPosition(Game.Items.createRandom(), z);
      }
    }
    // Add weapons and armor to the map in random positions and floors
    let templates = [
      "dagger",
      "sword",
      "staff",
      "tunic",
      "chainmail",
      "platemail",
    ];
    for (let i = 0; i < templates.length; i++) {
      this.addItemAtRandomPosition(
        Game.Items.create(templates[i]),
        Math.floor(this._depth * Math.random())
      );
    }
    // Add a hole to the final cavern on the last level.
    let holePosition = this.getRandomFloorPosition(this._depth - 1);
    this._tiles[this._depth - 1][holePosition.x][holePosition.y] =
      Game.Tile.holeToCavernTile;
  }
}

export default Cave