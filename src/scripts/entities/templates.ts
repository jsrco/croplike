import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'


export const demoEntity: EntityMap = {
    name: 'demo',
    componentMap: {
        graphics: true,
        position: true,
        size: true,
        velocity: true,
    },
    options: {
        graphics: {
            color: ColorSwatch.red[3]
        },
        position: {
            x: 5, y: 0
        },
        size: { 
            width: 1
        }, 
    }
}

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        graphics: true,
        position: true,
        size: true,
        velocity: true,
    },
    options: {
        graphics: {
            color: ColorSwatch.green[3]
        },
        position: {
            x: 0, y: 0
        },
        size: { 
            width: 1 
        }, 
    }
}