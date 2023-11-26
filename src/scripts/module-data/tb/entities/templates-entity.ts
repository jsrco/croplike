import { EntityMap } from "../../../entities/create-entity"
import { ColorSwatch } from '../../../util/color-swatch'

export const dummy: EntityMap = {
    name: 'dummy',
    componentMap: {
        movement: true,
        pixi: true,
        position: true,
        size: true,
    },
    options: {
        allowedMoves: 4,
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
        movement: true,
        pixi: true,
        position: true,
        size: true,
    },
    options: {
        canPush: true,
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

export const pushMe: EntityMap = {
    name: 'pushable',
    componentMap: {
        movement: true,
        pixi: true,
        position: true,
        size: true,
    },
    options: {
        canBePushed: true,
        color: ColorSwatch.yellow[3],
        position: {
            x: 200,
            y: 200,
        },
        size: {
            x: 20,
            y: 20,
        },
    }
}