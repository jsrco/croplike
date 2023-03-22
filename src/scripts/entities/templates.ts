import { EntityMap } from "./Create"


export const ceiling: EntityMap = {
    name: 'ceiling',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: false,
        jump: false,
        position: true,
        size: true,
        velocity: true,
        wallCollision: false,
        wall: true,
    }
}
export const floor: EntityMap = {
    name: 'floor',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: false,
        jump: false,
        position: true,
        size: true,
        velocity: true,
        wallCollision: false,
        wall: true,
    }
}
export const largeEntity: EntityMap = {
    name: 'largeEntity',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: true,
        jump: false,
        position: true,
        size: true,
        velocity: true,
        wallCollision: true,
        wall: false,
    }, options: { 
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
            x: -1 
        } 
    }
}
export const leftWall: EntityMap = {
    name: 'leftWall',
    componentMap: {
        collision: true,
        graphics: true,
        gravity: false,
        jump: false,
        position: true,
        size: true,
        velocity: true,
        wallCollision: false,
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
        wall: false,
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
        gravity: false,
        jump: false,
        position: true,
        size: true,
        velocity: true,
        wallCollision: false,
        wall: true,
    }
}