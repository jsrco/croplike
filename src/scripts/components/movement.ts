import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class MovementComponent extends Component {

    allowedMoves: number = 1
    type: string = 'movement'

    constructor(entity: Entity, world: World, options: { allowedMoves: number }) {
        super(entity, world)
        const { allowedMoves } = options
        if (allowedMoves) this.setAllowedMoves(allowedMoves)
    }

    setAllowedMoves(allowedMoves: number) {
        this.allowedMoves = allowedMoves
    }

}