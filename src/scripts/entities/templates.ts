import { EntityMap } from "./Create"
import { ColorSwatch } from '../util/ColorSwatch'

export const player: EntityMap = {
    name: 'player',
    componentMap: {
        graphics: true,
        position: true,
        size: true,
    },
    options: {
        graphics: {
            color: ColorSwatch.green[3]
        },
        position: {
            x: 0, y: 0
        },
        size: { 
            width: 0.03 
        }, 
    }
}