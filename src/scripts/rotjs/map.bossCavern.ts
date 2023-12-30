import { EntityRepository } from './entities';
import { Map } from './map'
import { Tile } from './tile';
import { setPosition } from './utility';

export class BossCavern extends Map {
  constructor() {
    super(generateTiles(80, 24))
    this.addEntityAtRandomPosition(EntityRepository.create("giant zombie"), 0)
  }
  addEntity(entity) {
    Map.prototype.addEntity.call(this, entity)
    if (this.player === entity) {
        const position = this.getRandomFloorPosition(0)
        setPosition(entity, position.x, position.y, 0)
        this.engine.start()
    }
}
}
const fillCircle = (tiles, centerX, centerY, radius, tile) => {
    let x = radius
    let y = 0
    let xChange = 1 - (radius << 1)
    let yChange = 0
    let radiusError = 0

    while (x >= y) {    
        for (let i = centerX - x; i <= centerX + x; i++) {
            tiles[i][centerY + y] = tile
            tiles[i][centerY - y] = tile
        }
        for (let i = centerX - y; i <= centerX + y; i++) {
            tiles[i][centerY + x] = tile
            tiles[i][centerY - x] = tile
        }
        y++
        radiusError += yChange
        yChange += 2
        if (((radiusError << 1) + xChange) > 0) {
            x--
            radiusError += xChange
            xChange += 2
        }
    }
}
const generateTiles = (width, height) => {
    const tiles = new Array(width)
    for (let x = 0; x < width; x++) {
        tiles[x] = new Array(height)
        for (let y = 0; y < height; y++) {
            tiles[x][y] = Tile.wallTile
        }
    }
    const radius = (Math.min(width, height) - 2) / 2
    fillCircle(tiles, width / 2, height / 2, radius, Tile.floorTile)
    const lakes = Math.round(Math.random() * 3) + 3
    const maxRadius = 2
    for (let i = 0; i < lakes; i++) {
        let centerX = Math.floor(Math.random() * (width - (maxRadius * 2)))
        let centerY = Math.floor(Math.random() * (height - (maxRadius * 2)))
        centerX += maxRadius
        centerY += maxRadius
        const radius = Math.floor(Math.random() * maxRadius) + 1
        fillCircle(tiles, centerX, centerY, radius, Tile.waterTile)
    }
    return [tiles]
}