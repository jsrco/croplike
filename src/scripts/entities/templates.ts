import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'


export const demoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        velocity: true,
    },
    options: {
        collision: {
            x: 5, y: 0
        },
        graphics: {
            color: ColorSwatch.red[3]
        },
        size: { 
            width: 1
        }, 
    }
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        velocity: true,
    },
    options: {
        collision: {
            x: 0, y: 0
        },
        graphics: {
            color: ColorSwatch.green[3]
        },
        size: { 
            width: 1 
        }, 
    }
}