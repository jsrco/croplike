import { EntityMap } from "./create"
import { ColorSwatch } from '../util/color-swatch'


export const bigDemoEntity: EntityMap = {
    name: 'bigDemo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'KinematicVelocityBased',
        canGrow: true,
        color: ColorSwatch.red[3],
        dominance: {
            isIt: true,
            group: 1
        },
        position: {
            x: 149,
            y: 1400,
        },
        size: {
            x: 90,
            y: 200,
        },
        velocity: {
            x: -12,
            y: 0,
        }
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
            x: 90,
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
            x: 60,
            y: 1450,
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