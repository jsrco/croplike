import { Component } from "."
import { World } from "../util/World"

export class SizeChangeComponent extends Component {
    isShrinking: boolean = false
    isSizeChanger: boolean = true
    type: string = 'sizeChange'

    constructor(world: World) {
        super(world)
    }
    setIsShrinking(isIt: boolean) {
        this.isShrinking = isIt
    }
}
