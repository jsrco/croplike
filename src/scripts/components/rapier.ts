import * as PIXI from "pixi.js"
import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class RapierComponent extends Component {

    body: RAPIER.RigidBody
    bodyGraphics: PIXI.Graphics
    collider: RAPIER.Collider
    colliderGraphics: PIXI.Graphics
    isOnGround: boolean = false
    type: string = 'rapier'

    constructor(entity: Entity, world: World, options: { position: { x: number, y: number }, size: { height: number, width: number }, type: string, }) {
        super(entity, world)

        const { position, size, type } = options

        const rigidBodyDesc = type === 'dynamic' ? RAPIER.RigidBodyDesc.dynamic() : RAPIER.RigidBodyDesc.fixed()
        rigidBodyDesc.setTranslation(position.x, position.y)
        rigidBodyDesc.setCanSleep(false).lockRotations()
        this.body = this.world.physicsWorld.createRigidBody(rigidBodyDesc)

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.width / 2, size.height / 2)
        this.collider = this.world.physicsWorld.createCollider(colliderDesc, this.body)
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

        this.owner.handle = this.collider.handle

        this.bodyGraphics = new PIXI.Graphics()
        this.world.engine.app.stage.addChild(this.bodyGraphics)
        this.colliderGraphics = new PIXI.Graphics()
        this.world.engine.app.stage.addChild(this.colliderGraphics)
        this.updateGraphics()

    }

    setIsOnGround(isIt: boolean) {
        this.isOnGround = isIt
    }

    setVelocity(velocity: { x: number, y: number }) {
        this.body.setLinvel(velocity, true)
    }

        // Add this method to update the collider visualization based on the current state
        updateGraphics() {
            const { x, y } = this.body.translation()
            const { halfExtents } = this.collider.shape as RAPIER.Cuboid
            // Clear previous graphics and draw the new shape
            this.colliderGraphics.clear();
            this.colliderGraphics.lineStyle(2, 0xFFFFFF); // Set line color and width
            this.colliderGraphics.drawRect(x - halfExtents.x, y - halfExtents.y, halfExtents.x * 2, halfExtents.y * 2);
        }

}