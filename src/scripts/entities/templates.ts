import { EntityMap } from "./create"
import { ColorSwatch } from '../util/color-swatch'


export const bigDemoEntity: EntityMap = {
    name: 'bigDemo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'dynamic',
        canGrow: true,
        color: ColorSwatch.red[3],
        dominance: {
            isIt: true,
            group: 1
        },
        position: {
            x: 100,
            y: 1400,
        },
        size: {
            x: 20,
            y: 90,
        },
    }
}

export const demoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'dynamic',
        color: ColorSwatch.red[3],
        position: {
            x: 225,
            y: 1400,
        },
        size: {
            x: 10,
            y: 10,
        },
    }
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'dynamic',
        color: ColorSwatch.green[3],
        position: {
            x: 250,
            y: 1400,
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