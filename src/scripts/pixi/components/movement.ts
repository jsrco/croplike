import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class MovementComponent extends Component {

    allowedMoves: number = 1
    canBePushed: boolean = false
    canPush: boolean = false
    type: string = 'movement'

    constructor(entity: Entity, world: World, options: { allowedMoves: number, canBePushed: boolean, canPush: boolean }) {
        super(entity, world)
        const { allowedMoves, canBePushed, canPush } = options
        if (allowedMoves) this.setAllowedMoves(allowedMoves)
        if (canBePushed) this.setCanBePushed(canBePushed)
        if (canPush) this.setCanPush(canPush)
    }

    setAllowedMoves(allowedMoves: number) {
        this.allowedMoves = allowedMoves
    }

    setCanBePushed(canIt: boolean) {
        this.canBePushed = canIt
    }
    
    setCanPush(canIt: boolean) {
        this.canPush = canIt
    }

}