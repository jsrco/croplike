import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class CollisionComponent extends Component {

    body: RAPIER.RigidBody
    collider: RAPIER.Collider
    type: string = 'collision'

    constructor(entity: Entity, world: World, x: number, y: number) {
        super(entity, world)
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        rigidBodyDesc.setTranslation(x, y)
        this.body = this.world.physicsWorld.createRigidBody(rigidBodyDesc)
        const colliderDesc = RAPIER.ColliderDesc.cuboid(.5, .5)
        this.collider = this.world.physicsWorld.createCollider(colliderDesc, this.body)
        this.world.eventManager.subscribe('velocityChange', this.onVelocityChange.bind(this))
        // this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }

    onVelocityChange(data: any): void {
        if (data.entity === this.owner) {
            const velocityComponent = data.velocityComponent
            this.body.setLinvel({ x: velocityComponent.x, y: velocityComponent.y}, true)
        }
    }

    // onSizeChange(data: any): void {
    //     if (data.entity === this.owner) {
    //         const sizeComponent = data.sizeComponent
    //         this.rectangle.height = sizeComponent.height
    //         this.rectangle.width = sizeComponent.width
    //     }
    // }

}