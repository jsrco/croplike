import { EntityRepository } from './entities'
import { ItemRepository } from './item'
import { Map } from './map'
import { Tile } from './tile'

export class Cave extends Map {
    constructor(tiles: string | any[], player: any) {
        super(tiles)
        this.addEntityAtRandomPosition(player, 0)
        for (let z = 0; z < this.depth; z++) {
            for (let i = 0; i < 25; i++) {
                const entity = EntityRepository.createRandom()
                this.addEntityAtRandomPosition(entity, z)
                if (entity.hasMixin("ExperienceGainer")) {
                    for (let level = 0; level < z; level++) {
                        entity.giveExperience(
                            entity.getNextLevelExperience() - entity.experience
                        )
                    }
                }
            }
            for (let i = 0; i < 15; i++) {
                this.addItemAtRandomPosition(ItemRepository.createRandom(), z)
            }
        }
        const templates = ['dagger', 'ssword', 'lsword',
            'tunic', 'chainmail', 'platemail']
        for (let i = 0; i < templates.length; i++) {
            this.addItemAtRandomPosition(
                ItemRepository.create(templates[i]),
                Math.floor(this.depth * Math.random())
            );
        }
        const holePosition = this.getRandomFloorPosition(this.depth - 1)
        // console.log("Boss Cave:")
        // console.log(holePosition)
        this.tiles[this.depth - 1][holePosition.x][holePosition.y] =
            Tile.holeToCavernTile
    }
}