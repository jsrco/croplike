import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'


export const bigDemoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'dynamic',
        color: ColorSwatch.red[3],
        position: {
            x: 60,
            y: 200,
        },
        size: {
            height: 90,
            width: 20,
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
            y: 10,
        },
        size: {
            height: 10,
            width: 10,
        },
    }
}

export const floor: EntityMap = {
    name: 'floor',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        bodyType: 'fixed',
        color: ColorSwatch.blue[3],
        isOnGround: true,
        position: {
            x: 550,
            y: 300,
        },
        size: {
            height: 10,
            width: 1000,
        },
    },
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
            y: 10,
        },
        size: {
            height: 20,
            width: 20,

        },
    }
}