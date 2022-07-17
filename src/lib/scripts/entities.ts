import { ColorSwatch } from "./colorSwatch";
import { Mixins } from "./mixins";

export const Templates = {
  FungusTemplate: {
    character: 'fThick',
    foreground: ColorSwatch.green[4],
    mixins: [Mixins.FungusActor, Mixins.Destructible]
  },
  PlayerTemplate: {
    attackValue: 10,
    character: "@",
    foreground: "white",
    inventorySlots: 22,
    maxHp: 40,
    mixins: [Mixins.Moveable, Mixins.PlayerActor,
    Mixins.SimpleAttacker, Mixins.Destructible]
  }
}