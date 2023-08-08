import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'


export const bigDemoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        color: ColorSwatch.red[3],
        position: {
            x: 60,
            y: 200,
        },
        size: {
            height: 90,
            width: 20,
        },
        type: 'dynamic',
    }
}

export const demoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        color: ColorSwatch.red[3],
        position: {
            x: 225,
            y: 10,
        },
        size: {
            height: 10,
            width: 10,
        },
        type: 'dynamic',
    }
}

export const floor: EntityMap = {
    name: 'floor',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        color: ColorSwatch.blue[3],
        position: {
            x: 550,
            y: 300,
        },
        size: {
            height: 10,
            width: 1000,
        },
        type: 'fixed',
    },
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        pixi: true,
        rapier: true,
    },
    options: {
        color: ColorSwatch.green[3],
        position: {
            x: 250,
            y: 10,
        },
        size: {
            height: 20,
            width: 20,

        },
        type: 'dynamic',
    }
}