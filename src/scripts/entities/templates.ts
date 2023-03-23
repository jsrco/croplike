import { EntityMap } from "./Create"


export const ceiling: EntityMap = {
    name: 'ceiling',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        wall: true,
    }
}
export const floor: EntityMap = {
    name: 'floor',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        wall: true,
    }
}
export const largeEntity: EntityMap = {
    name: 'largeEntity',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: true,
        position: true,
        size: true,
        velocity: true,
        wallCollision: true,
    }, 
    options: { 
        gravity: { 
            force: 0.3
        }, 
        position: { 
            x: 200, y: 300 
        }, 
        size: { 
            width: 190 
        }, 
        velocity: { 
            x: -2 
        } 
    }
}
export const leftWall: EntityMap = {
    name: 'leftWall',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        wall: true,
    }
}
export const player: EntityMap = {
    name: 'player',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: true,
        jump: true,
        position: true,
        size: true,
        velocity: true,
        wallCollision: true,
    },
    options: {
        graphics: {
            color: 0xFFFFFF
        },
        position: {
            x: 30, y: 30
        }
    }
}
export const rightWall: EntityMap = {
    name: 'rightWall',
    componentMap: {
        collision: true,
        graphics: true,
        position: true,
        size: true,
        wall: true,
    }
}