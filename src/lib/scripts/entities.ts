import { ColorSwatch } from './colorSwatch'
import { Mixins } from './mixins'
export const Templates = {
  FungusTemplate: {
    character: 'fThick',
    foreground: ColorSwatch.green[4],
    maxHp: 10,
    mixins: [Mixins.FungusActor, Mixins.Destructible],
    name:'fungal growth',
  },
  PlayerTemplate: {
    attackValue: 10,
    character: '@',
    foreground: 'white',
    maxHp: 40,
    mixins: [Mixins.Moveable, Mixins.PlayerActor,
    Mixins.Attacker, Mixins.Destructible, Mixins.MessageRecipient],
    name: 'player'
  }
}