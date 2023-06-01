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
        outOfBounds: true,
        position: true,
        size: true,
        sizeChange: true,
        velocity: true,
        wallCollision: true,
    }, 
    options: { 
        graphics: {
            color: 0xF8719D,
        },
        gravity: { 
            force: 0.3
        }, 
        position: { 
            x: 250, y: 1440 - 200 
        }, 
        size: { 
            height: 200,
            width: 200 
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
        outOfBounds: true,
        position: true,
        size: true,
        velocity: true,
        wallCollision: true,
    },
    options: {
        graphics: {
            color: 0x4ade80
        },
        position: {
            x: 60, y: 1440 - 10
        },
        size: { 
            width: 10 
        }, 
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