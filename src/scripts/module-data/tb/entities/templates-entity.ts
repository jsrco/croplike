import { EntityMap } from "../../../entities/create-entity"
import { ColorSwatch } from '../../../util/color-swatch'

export const dummy: EntityMap = {
    name: 'dummy',
    componentMap: {
        pixi: true,
    },
    options: {
        color: ColorSwatch.red[3],
        position: {
            x: 100,
            y: 100,
        },
        size: {
            x: 60,
            y: 60,
        },
    }
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        pixi: true,
    },
    options: {
        color: ColorSwatch.green[3],
        position: {
            x: 80,
            y: 80,
        },
        size: {
            x: 20,
            y: 20,
        },
    }
}