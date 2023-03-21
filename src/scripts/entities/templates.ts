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