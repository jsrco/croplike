import { ColorSwatch } from './colorSwatch'
import { DynamicGlyph } from './dynamicGlyph'
import { ItemMixins } from './itemMixins'
import { Repository } from './repository'
export class Item extends DynamicGlyph {
  constructor(properties: {  background?: string, character?: string, description?: string, foreground?: string, mixins?: any, name?: string }) {
    properties = properties || {}
    super(properties)
  }
}
export const ItemRepository = new Repository('items', Item)
ItemRepository.define('rock', {
  character: '*',
  description: 'a rock',
  foreground: 'white',
  name: 'rock',
})
// Edibles
ItemRepository.define('apple', {
  character: '%',
  consumptions: 1,
  description: 'a apple',
  foodValue: 50,
  foreground: ColorSwatch.red[4],
  mixins: [ItemMixins.Edible],
  name: 'apple',
})
ItemRepository.define('corpse', {
  character: '%',
  consumptions: 1,
  description: 'a corpse',
  foodValue: 75,
  foreground: ColorSwatch.blueGray[4],
  mixins: [ItemMixins.Edible],
  name: 'corpse',
}, {
  disableRandomCreation: true
})
ItemRepository.define('melon', {
  character: '%',
  consumptions: 4,
  description: 'a melon',
  foodValue: 35,
  foreground: ColorSwatch.green[4],
  mixins: [ItemMixins.Edible],
  name: 'melon',
})
// Weapons
ItemRepository.define('dagger', {
  attackValue: 5,
  character: 'sword',
  description: 'a dagger',
  foreground: ColorSwatch.green[5],
  mixins: [ItemMixins.Equippable],
  name: 'dagger',
  wieldable: true,
}, {
  disableRandomCreation: true
})
ItemRepository.define('ssword', {
  attackValue: 5,
  character: 'sword',
  defenseValue: 3,
  description: 'a short sword',
  foreground: ColorSwatch.blue[5],
  mixins: [ItemMixins.Equippable],
  name: 'short sword',
  wieldable: true,
}, {
  disableRandomCreation: true
})
ItemRepository.define('lsword', {
  attackValue: 10,
  character: 'sword',
  description: 'a long sword',
  foreground: ColorSwatch.indigo[5],
  wieldable: true,
  mixins: [ItemMixins.Equippable],
  name: 'long sword',
}, {
  disableRandomCreation: true
})
// Wearables
ItemRepository.define('chainmail', {
  character: 'shield',
  defenseValue: 4,
  description: 'a chainmail',
  foreground: ColorSwatch.blue[5],
  mixins: [ItemMixins.Equippable],
  name: 'chainmail',
  wearable: true,
}, {
  disableRandomCreation: true
})
ItemRepository.define('tunic', {
  character: 'shield',
  defenseValue: 2,
  description: 'a tunic',
  foreground: ColorSwatch.green[5],
  mixins: [ItemMixins.Equippable],
  name: 'tunic',
  wearable: true,
}, {
  disableRandomCreation: true
})
ItemRepository.define('platemail', {
  character: 'shield',
  defenseValue: 6,
  description: 'a platemail',
  foreground: ColorSwatch.indigo[5],
  mixins: [ItemMixins.Equippable],
  name: 'platemail',
  wearable: true,
}, {
  disableRandomCreation: true
})