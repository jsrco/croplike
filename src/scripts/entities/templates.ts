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
        dominance: {
            isIt: true,
            group: 1
        },
        position: {
            x: 60,
            y: 200,
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
            y: 10,
        },
        size: {
            x: 10,
            y: 10,
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
            x: 1000,
            y: 10,
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
            x: 20,
            y: 20,
        },
    }
}