export class TileMap {
    mapHeight: number
    mapWidth: number
    tiles: Array<Array<number>>
    constructor(properties) {
        this.mapHeight = properties.mapHeight;
        this.mapWidth = properties.mapWidth;
        this.tiles = this.builder();
    }
    builder(): Array<Array<number>> {
        const tileMap = []
        for (let x = 0; x < this.mapWidth; x++) {
            tileMap.push([]);
            for (let y = 0; y < this.mapHeight; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.mapWidth - 1 ||
                    y === this.mapHeight - 1 ||
                    (x % 4 === 0 && y % 4 === 0)
                ) {
                    tileMap[x].push(1)
                } else {
                    tileMap[x].push(0)
                }
            }
        }
        return tileMap
    }
}