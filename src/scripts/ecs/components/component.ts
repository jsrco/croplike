import * as PIXI from 'pixi.js'

export interface Component {
    name: string
    update(delta: number): void
}


class PositionComponent implements Component {
    public name = "position";

    constructor(public x: number, public y: number) { }

    public update(delta: number): void {
        // Do nothing
    }
}

export class SpriteComponent implements Component {
    public name = "sprite";
    public sprite: PIXI.Sprite

    constructor(texture: PIXI.Texture) {
        this.sprite = new PIXI.Sprite(texture)
    }

    public update(delta: number): void {
        // Do nothing
    }
}

export class VelocityComponent implements Component {
    public name = "velocity";

    constructor(public x: number, public y: number) { }

    public update(delta: number): void {
        // Do nothing
    }
}
