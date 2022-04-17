import DynamicGlyph from "./DynamicGlyph";
import Mixins from "./mixins/Mixins";
import Repository from "./Repository";

class Item extends DynamicGlyph {
  constructor(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    // Call glyph constructor with set of properties
    super(properties);
    this._name = properties["name"] || "";
  }
}

export default Item;

//https://www.canva.com/colors/color-meanings/indigo/

let ItemRepository = new Repository("items", Item);

ItemRepository.define(
  "corpse",
  {
    character: "%",
    consumptions: 1,
    foodValue: 75,
    mixins: [Mixins.Edible],
    name: "corpse",
  },
  {
    disableRandomCreation: true,
  }
);

ItemRepository.define("unmoving flesh ", {
  character: "%",
  foreground: "#7D38B3",
  foodValue: 50,
  mixins: [Mixins.Edible],
  name: "unmoving flesh",
});

ItemRepository.define("mushroom", {
  character: "%",
  consumptions: 4,
  foodValue: 35,
  foreground: "#003F00",
  mixins: [Mixins.Edible],
  name: "mushroom",
});

ItemRepository.define("rock", {
  character: "*",
  foreground: "#964FCC",
  name: "rock",
});

// Multi

ItemRepository.define("largeShroom", {
  attackValue: 2,
  character: "%",
  consumptions: 4,
  defenseValue: 2,
  foodValue: 50,
  foreground: "#002B00",
  mixins:[Mixins.Edible, Mixins.Equippable],
  wearable: true,
  wieldable: true,
  name: "large mushroom",
});

// Wear
ItemRepository.define(
  "tunic",
  {
    character: "[",
    defenseValue: 2,
    foreground: "#D98030",
    mixins: [Mixins.Equippable],
    name: "tunic",
    wearable: true,
  },
  {
    disableRandomCreation: true,
  }
);

ItemRepository.define(
  "chainmail",
  {
    character: "[",
    defenseValue: 4,
    foreground: "#AC97C0",
    mixins: [Mixins.Equippable],
    name: "chainmail",
    wearable: true,
  },
  {
    disableRandomCreation: true,
  }
);

ItemRepository.define(
  "platemail",
  {
    character: "[",
    defenseValue: 6,
    foreground: "#FDC320",
    mixins: [Mixins.Equippable],
    name: "platemail",
    wearable: true,
  },
  {
    disableRandomCreation: true,
  }
);

// Wield
ItemRepository.define(
  "dagger",
  {
    attackValue: 3,
    character: ")",
    foreground: "#D98030",
    mixins: [Mixins.Equippable],
    name: "dagger",
    wieldable: true,
  },
  {
    disableRandomCreation: true,
  }
);

ItemRepository.define(
  "sword",
  {
    attackValue: 10,
    character: ")",
    foreground: "#FDC320",
    mixins: [Mixins.Equippable],
    name: "sword",
    wieldable: true,
  },
  {
    disableRandomCreation: true,
  }
);

ItemRepository.define(
  "staff",
  {
    attackValue: 5,
    character: ")",
    defenseValue: 3,
    foreground: "#AC97C0",
    mixins: [Mixins.Equippable],
    name: "staff",
    wieldable: true,
  },
  {
    disableRandomCreation: true,
  }
);

export { ItemRepository };
