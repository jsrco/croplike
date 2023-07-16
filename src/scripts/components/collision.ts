import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class CollisionComponent extends Component {

    body: RAPIER.RigidBody
    collider: RAPIER.Collider
    type: string = 'collision'

    constructor(entity: Entity, world: World) {
        super(entity, world)
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        this.body = this.world.physicsWorld.createRigidBody(rigidBodyDesc)
        const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1)
        this.collider = this.world.physicsWorld.createCollider(colliderDesc, this.body)
        // this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        // this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }

    // onPositionChange(data: any): void {
    //     if (data.entity === this.owner) {
    //         const positionComponent = data.positionComponent
    //         this.rectangle.x = positionComponent.x
    //         this.rectangle.y = positionComponent.y
    //     }
    // }

    // onSizeChange(data: any): void {
    //     if (data.entity === this.owner) {
    //         const sizeComponent = data.sizeComponent
    //         this.rectangle.height = sizeComponent.height
    //         this.rectangle.width = sizeComponent.width
    //     }
    // }

}