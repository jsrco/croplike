import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class RapierComponent extends Component {

    body: RAPIER.RigidBody
    collider: RAPIER.Collider
    isOnGround: boolean = false
    type: string = 'rapier'

    constructor(entity: Entity, world: World, options: { position: { x: number, y: number }, size: { height: number, width: number }, type: string, }) {
        super(entity, world)

        const { position, size, type } = options

        const rigidBodyDesc = type === 'dynamic' ? RAPIER.RigidBodyDesc.dynamic() : RAPIER.RigidBodyDesc.fixed()
        rigidBodyDesc.setTranslation(position.x, position.y)
        rigidBodyDesc.setCanSleep(false)
        this.body = this.world.physicsWorld.createRigidBody(rigidBodyDesc)

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.width / 2, size.height / 2)
        this.collider = this.world.physicsWorld.createCollider(colliderDesc, this.body)
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

        this.owner.handle = this.collider.handle
    }

    setIsOnGround(isIt: boolean) {
        this.isOnGround = isIt
    }

    setVelocity(velocity: { x: number, y: number }) {
        this.body.setLinvel(velocity, true)
    }

}