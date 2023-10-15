import { ColorSwatch } from '../util/color-swatch'
import { EntityMap } from "./create-entity"

export const wall: EntityMap = {
    name: 'wall',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'fixed',
        color: ColorSwatch.blue[3],
        isOnGround: true,
        position: {
            x: 0,
            y: 0,
        },
        size: {
            x: 0,
            y: 0,
        },
    },
}