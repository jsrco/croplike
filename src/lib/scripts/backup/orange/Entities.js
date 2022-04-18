import Entity from "./Entity";
import Mixins from "./mixins/Mixins";
import Repository from "./Repository";

let EntityRepository = new Repository("entities", Entity);

//https://www.canva.com/colors/color-meanings/indigo/

EntityRepository.define("arachnid", {
  attackValue: 4,
  character: "a",
  foreground: "#87001C",
  maxHp: 7,
  mixins: [
    Mixins.Attacker,
    Mixins.CorpseDropper,
    Mixins.Destructible,
    Mixins.ExperienceGainer,
    Mixins.RandomStatGainer,
    Mixins.Sight,
    Mixins.TaskActor,
  ],
  name: "arachnid",
  sightRadius: 12,
  tasks: ["hunt", "wander"],
});

EntityRepository.define("floating pod", {
  attackValue: 4,
  character: "p",
  foreground: "#7E0051",
  maxHp: 5,
  mixins: [
    Mixins.Attacker,
    Mixins.CorpseDropper,
    Mixins.Destructible,
    Mixins.ExperienceGainer,
    Mixins.RandomStatGainer,
    Mixins.TaskActor,
  ],
  name: "floating pod",
  speed: 2000,
});

EntityRepository.define("fungus", {
  character: "f",
  foreground: "#7E0051",
  maxHp: 10,
  mixins: [
    Mixins.Destructible,
    Mixins.ExperienceGainer,
    Mixins.FungusActor,
    Mixins.RandomStatGainer,
  ],
  name: "fungus",
  speed: 250,
});

EntityRepository.define("slithering flesh", {
  attackValue: 5,
  character: "s",
  foreground: "#87001C",
  maxHp: 10,
  mixins: [
    Mixins.Attacker,
    Mixins.CorpseDropper,
    Mixins.Destructible,
    Mixins.ExperienceGainer,
    Mixins.RandomStatGainer,
    Mixins.Sight,
    Mixins.TaskActor,
  ],
  name: "slithering flesh",
  sightRadius: 3,
  tasks: ["hunt", "wander"],
});

// Boss
EntityRepository.define(
  "giant horror",
  {
    attackValue: 8,
    character: "H",
    defenseValue: 5,
    foreground: "#780000",
    level: 5,
    maxHp: 50,
    mixins: [
      Mixins.Attacker,
      Mixins.CorpseDropper,
      Mixins.Destructible,
      Mixins.ExperienceGainer,
      Mixins.GiantHorrorActor,
      Mixins.Sight,
      Mixins.TaskActor,
    ],
    name: "giant horror",
    sightRadius: 6,
    tasks: ["grow", "spawn", "hunt", "wander"]
  },
  {
    disableRandomCreation: true,
  }
);

let Player = {
  attackValue: 10,
  character: "@",
  foreground: "white",
  inventorySlots: 22,
  maxHp: 40,
  mixins: [
    Mixins.Attacker,
    Mixins.Destructible,
    Mixins.Equipper,
    Mixins.ExperienceGainer,
    Mixins.FoodConsumer,
    Mixins.InventoryHolder,
    Mixins.MessageRecipient,
    Mixins.PlayerActor,
    Mixins.PlayerStatGainer,
    Mixins.Sight,
  ],
  name: 'human (you)',
  sightRadius: 6,
};

export { EntityRepository, Player };
