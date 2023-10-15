import { ColorSwatch } from '../../shared/util/color-swatch'
import { EntityMap } from "./create-entity"

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        pixi: true,
    },
    options: {
        color: ColorSwatch.green[3],
        position: {
            x: 20,
            y: 20,
        },
        size: {
            x: 20,
            y: 20,
        },
    }
}

export const wall: EntityMap = {
    name: 'wall',
    componentMap: {
        pixi: true,
    },
    options: {
        color: ColorSwatch.blue[3],
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