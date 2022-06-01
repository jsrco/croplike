import type { Position, TileConfig } from '$lib/scripts/interfaces/index'
export class Tile {
    tileConfig: TileConfig
    constructor(tileConfig: TileConfig) {
        this.tileConfig = tileConfig
    }
    draw(ctx: CanvasRenderingContext2D): void {
        const { fillStyle, position, size } = this.tileConfig
        const { x, y } = position
        ctx.moveTo(x, y);
        ctx.rect(x, y, size, size);
        ctx.fillStyle = fillStyle
        ctx.fill();
    }
    updatePosition(position: Position): void {
        this.tileConfig.position.x += position.x
        this.tileConfig.position.y += position.y
    }
}