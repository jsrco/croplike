import { ColorSwatch } from './colorSwatch'
import { Entity } from './entity'
import { EntityMixins } from './entityMixins'
import { Repository } from './repository'
export const EntityRepository = new Repository('entities', Entity)
export const Templates = {
  PlayerTemplate: {
    attackValue: 10,
    character: '@',
    description: 'the hero - also an ass',
    facing: 4,
    foreground: 'white',
    inventorySlots: 5,
    maxHp: 50,
    mixins: [EntityMixins.PlayerActor,
    EntityMixins.Attacker, EntityMixins.Destructible, EntityMixins.InventoryHolder, EntityMixins.FoodConsumer, EntityMixins.Sight, EntityMixins.MessageRecipient, EntityMixins.Equipper, EntityMixins.ExperienceGainer, EntityMixins.PlayerStatGainer],
    name: 'player',
    sightRadius: 8,
  }
}
EntityRepository.define('bat', {
  attackValue: 4,
  character: 'bThick',
  description: 'a bat that is faster than you and flies randomly',
  foreground: ColorSwatch.orange[4],
  maxHp: 5,
  mixins: [EntityMixins.TaskActor,
  EntityMixins.Attacker, EntityMixins.Destructible, EntityMixins.CorpseDropper, EntityMixins.RandomStatGainer],
  name: 'bat',
  speed: 2000,
  tasks: ['wander'],
})
EntityRepository.define('fungus', {
  character: 'fThick',
  description: 'a fungus it grows randomly',
  foreground: ColorSwatch.green[4],
  maxHp: 10,
  mixins: [EntityMixins.FungusActor, EntityMixins.Destructible, EntityMixins.RandomStatGainer],
  name: 'fungus',
  speed: 250,
})
EntityRepository.define('giant zombie', {
  attackValue: 8,
  character: 'zThick',
  description: 'a giant zombie with extra arms and slime that grow from it',
  defenseValue: 5,
  foreground: ColorSwatch.orange[7],
  level: 5,
  maxHp: 30,
  mixins: [EntityMixins.GiantZombieActor, EntityMixins.Sight,
  EntityMixins.Attacker, EntityMixins.Destructible,
  EntityMixins.CorpseDropper,
  EntityMixins.ExperienceGainer, EntityMixins.TaskActor],
  name: 'giant zombie',
  sightRadius: 6,
  tasks: ["growArm", "spawnSlime", "hunt", "wander"]
}, {
  disableRandomCreation: true
})
EntityRepository.define('kobold', {
  attackValue: 4,
  character: 'kThick',
  description: 'a kobold that hunts player if seen',
  foreground: ColorSwatch.blue[4],
  maxHp: 6,
  mixins: [EntityMixins.TaskActor, EntityMixins.Sight,
  EntityMixins.Attacker, EntityMixins.Destructible,
  EntityMixins.CorpseDropper, EntityMixins.RandomStatGainer],
  name: 'kobold',
  sightRadius: 5,
  tasks: ['hunt', 'wander'],
})
EntityRepository.define('newt', {
  attackValue: 2,
  character: 'nThick',
  description: 'a newt that hunts player if seen',
  foreground: ColorSwatch.yellow[4],
  maxHp: 3,
  mixins: [EntityMixins.TaskActor,
  EntityMixins.Attacker, EntityMixins.Sight, EntityMixins.Destructible, EntityMixins.CorpseDropper, EntityMixins.RandomStatGainer],
  name: 'newt',
  sightRadius: 4,
  tasks: ['hunt', 'wander'],
})
EntityRepository.define('slime', {
  attackValue: 5,
  character: 'sThick',
  description: 'a slime that hunts player if seen',
  foreground: ColorSwatch.green[2],
  maxHp: 10,
  name: 'slime',
  mixins: [EntityMixins.TaskActor, EntityMixins.Sight,
  EntityMixins.Attacker, EntityMixins.Destructible,
  EntityMixins.CorpseDropper,
  EntityMixins.ExperienceGainer, EntityMixins.RandomStatGainer],
  sightRadius: 3,
  tasks: ['hunt', 'wander'],
})