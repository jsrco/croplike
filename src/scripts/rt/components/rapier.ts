import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Component } from "../../shared/components/component"
import { Entity } from "../../shared/entities/entity"
import { Room } from "../util/room"

export class RapierComponent extends Component {

    body: RAPIER.RigidBody
    bodyType: string
    canGrow: boolean = false
    cleared: boolean = false
    collider: RAPIER.Collider
    colliderGraphics: PIXI.Graphics
    dominance: object = { isIt: false, group: 0 }
    isColliding: boolean = false
    isOnGround: boolean = false
    isRiding: boolean = false
    isStoodOn: boolean = false
    type: string = 'rapier'
    velocity: RAPIER.Vector = { x: 0, y: 0 }

    constructor(entity: Entity, room: Room, options: { bodyType: string, canGrow?: boolean, dominance?: { isIt: boolean, group: number }, isColliding?: boolean, isOnGround?: boolean, isRiding?: boolean, isStoodOn?: boolean, position: RAPIER.Vector, size: RAPIER.Vector, velocity?: RAPIER.Vector, }) {
        super(entity, room)

        const { bodyType, canGrow, dominance, isColliding, isOnGround, isRiding, isStoodOn, position, size, velocity } = options

        let rigidBodyDesc = this.getRigidBodyDesc(bodyType)
        rigidBodyDesc.setTranslation(position.x, position.y)
        rigidBodyDesc.setCanSleep(false).lockRotations()
        this.body = this.room.physicsWorld.createRigidBody(rigidBodyDesc)
        this.bodyType = bodyType

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2)
        this.collider = this.room.physicsWorld.createCollider(colliderDesc, this.body)
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

        this.colliderGraphics = new PIXI.Graphics()
        this.addColliderGraphics()
        this.owner.handle = this.collider.handle

        if (canGrow) this.canGrow = canGrow
        if (dominance && dominance.isIt) this.setDominance(dominance)
        if (isColliding) this.setIsColliding(isColliding)
        if (isOnGround) this.setIsOnGround(isOnGround)
        if (isRiding) this.setIsRiding(isRiding)
        if (isStoodOn) this.setIsStoodOn(isStoodOn)
        if (velocity) this.setVelocity(velocity)
    }

    addColliderGraphics(): void {
        this.room.engine.app.stage.addChild(this.colliderGraphics)
    }

    clearColliderGraphics(): void {
        this.cleared = true
        this.colliderGraphics.clear()
    }

    getRigidBodyDesc(string: string): RAPIER.RigidBodyDesc {
        if (string === 'fixed') return RAPIER.RigidBodyDesc.fixed()
        if (string === 'KinematicVelocityBased') return RAPIER.RigidBodyDesc.kinematicVelocityBased()
        return RAPIER.RigidBodyDesc.dynamic()
    }

    removeColliderGraphics(): void {
        this.room.engine.app.stage.removeChild(this.colliderGraphics)
    }

    setDominance(dominance: { isIt: boolean, group: number }): void {
        this.body.setDominanceGroup(dominance.group)
        this.dominance = dominance
    }

    setIsColliding(isIt: boolean): void {
        this.isColliding = isIt
    }

    setIsOnGround(isIt: boolean): void {
        this.isOnGround = isIt
    }

    setIsRiding(isIt: boolean): void {
        this.isRiding = isIt
    }

    setIsStoodOn(isIt: boolean): void {
        this.isStoodOn = isIt
    }

    setVelocity(velocity: RAPIER.Vector): void {
        this.body.setLinvel(velocity, true)
        this.velocity = velocity
    }

    // Add this method to update the collider visualization based on the current state
    updateGraphics(): void {
        const { x, y } = this.body.translation()
        const { halfExtents } = this.collider.shape as RAPIER.Cuboid
        // Clear previous graphics and draw the new shape
        this.cleared = false
        this.colliderGraphics.clear()
        this.colliderGraphics.lineStyle(6, 0xFFFFFF) // Set line color and width
        this.colliderGraphics.drawRect(x - halfExtents.x, y - halfExtents.y, halfExtents.x * 2, halfExtents.y * 2)
    }

}