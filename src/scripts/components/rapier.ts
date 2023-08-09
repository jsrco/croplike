import * as PIXI from "pixi.js"
import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class RapierComponent extends Component {

    body: RAPIER.RigidBody
    bodyType: string
    cleared: boolean = false
    collider: RAPIER.Collider
    colliderGraphics: PIXI.Graphics
    dominance: object = { isIt: false, group: 0 }
    isColliding: boolean = false
    isOnGround: boolean = false
    isStoodOn: boolean = false
    type: string = 'rapier'
    velocity: RAPIER.Vector = { x: 0, y: 0 }

    constructor(entity: Entity, world: World, options: { bodyType: string, dominance?: { isIt: boolean, group: number }, isColliding?: boolean, isOnGround?: boolean, isStoodOn: boolean, position: RAPIER.Vector, size: RAPIER.Vector, velocity?: RAPIER.Vector, }) {
        super(entity, world)

        const { bodyType, dominance, isColliding, isOnGround, isStoodOn, position, size, velocity } = options

        const rigidBodyDesc = bodyType === 'dynamic' ? RAPIER.RigidBodyDesc.dynamic() : RAPIER.RigidBodyDesc.fixed()
        rigidBodyDesc.setTranslation(position.x, position.y)
        rigidBodyDesc.setCanSleep(false).lockRotations()
        this.body = this.world.physicsWorld.createRigidBody(rigidBodyDesc)
        this.bodyType = bodyType

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2)
        this.collider = this.world.physicsWorld.createCollider(colliderDesc, this.body)
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

        this.colliderGraphics = new PIXI.Graphics()
        this.world.engine.app.stage.addChild(this.colliderGraphics)

        this.owner.handle = this.collider.handle
        
        if (dominance && dominance.isIt) this.setDominance(dominance)
        if (isColliding) this.setIsColliding(isColliding)
        if (isOnGround) this.setIsOnGround(isOnGround)
        if (isStoodOn) this.setIsStoodOn(isStoodOn)
        if (velocity) this.setVelocity(velocity)
    }

    clearColliderGraphics(): void { 
        this.cleared = true
        this.colliderGraphics.clear()
    }

    setDominance(dominance: { isIt: boolean, group: number }): void {
        this.body.setDominanceGroup(dominance.group)
        this.dominance = dominance
    }
    
    setIsColliding(isIt: boolean) {
        this.isColliding = isIt
    }

    setIsOnGround(isIt: boolean) {
        this.isOnGround = isIt
    }

    setIsStoodOn(isIt: boolean) {
        this.isStoodOn = isIt
    }

    setVelocity(velocity: RAPIER.Vector) {
        this.body.setLinvel(velocity, true)
        this.velocity = velocity
    }

    // Add this method to update the collider visualization based on the current state
    updateGraphics() {
        const { x, y } = this.body.translation()
        const { halfExtents } = this.collider.shape as RAPIER.Cuboid
        // Clear previous graphics and draw the new shape
        this.cleared = false
        this.colliderGraphics.clear()
        this.colliderGraphics.lineStyle(4, 0xFFFFFF) // Set line color and width
        this.colliderGraphics.drawRect(x - halfExtents.x, y - halfExtents.y, halfExtents.x * 2, halfExtents.y * 2)
    }

}