import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'


export const demoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        rapier: true,
        three: true,
    },
    options: {
        color: ColorSwatch.red[3],
        position: {
            x: 5,
            y: 5,
        },
        size: {
            height: 1,
            width: 1,
        },
        type: 'dynamic',
    }
}

export const floor: EntityMap = {
    name: 'floor',
    componentMap: {
        rapier: true,
        three: true,
    },
    options: {
        color: ColorSwatch.blue[3],
        position: {
            x: -20,
            y: 0,
        },
        size: {
            height: 1,
            width: 60,
        },
        type: 'fixed',
    },
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        rapier: true,
        three: true,
    },
    options: {
        color: ColorSwatch.green[3],
        position: {
            x: 0,
            y: 5,
        },
        size: {
            width: 1,
            height: 1
        },
        type: 'dynamic',
    }
}