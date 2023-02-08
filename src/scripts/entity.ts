import * as PIXI from 'pixi.js'

type TextureTypes = "run" | "idle" | "jump" | "slide"
export class Entity {
    animationSpeed: number
    drag: number = 0.95
    gravity: number = 0.4
    hanging: boolean = false
    jumpSpeed: number = 10
    maxSpeed: number = 6
    minWallSlideSpeed: number = 0.1
    path: number = 0
    name: string
    size: number
    sprite: PIXI.AnimatedSprite
    textures: any
    vx: number = 0
    vy: number = 0
    wallSlideSpeed: number = 1
    windowHeightDummy: number
    constructor(sprite: any, name: string, textures: any, animationSpeed: number = 0.1) {
        this.animationSpeed = animationSpeed
        this.name = name
        this.sprite = sprite
        this.textures = textures
        if (name === 'player') this.sprite.scale = {x:3,y:3}
        this.size = this.sprite.height
        this.windowHeightDummy =  window.innerHeight - 36 - this.size
    }
    private checkForCollisions(entities: Entity[]) {
        let count = 0
        for (const entity of entities) {
            count++
            if (entity === this) continue
            if (this.isCollidingWith(entity)) {
                if (this.name === 'player') {
                    let angle = Math.atan2(this.sprite.y - entity.sprite.y, this.sprite.x - entity.sprite.x)
                    let xDistance = Math.cos(angle) * 0.5
                    let yDistance = Math.sin(angle) * 0.5
                    let overlap = this.size + entity.size - this.getDistance(this, entity)
                    entity.sprite.x += xDistance * overlap
                    entity.sprite.y += yDistance * overlap
                }
            }
        }
    }
    private getDistance(entity1: Entity, entity2: Entity) {
        let a = entity1.sprite.x - entity2.sprite.x
        let b = entity1.sprite.y - entity2.sprite.y
        return Math.sqrt(a * a + b * b)
    }
    private isCollidingWith(other: Entity) {
        // Get the bounds of the first display object
        let bounds1 = this.sprite.getBounds()
        // Get the bounds of the second display object
        let bounds2 = other.sprite.getBounds()
        const x1 = this.sprite.x
        const y1 = this.sprite.y
        const x2 = other.sprite.x
        const y2 = other.sprite.y
        return bounds1.x + bounds1.width > bounds2.x && bounds1.x < bounds2.x + bounds2.width &&
        bounds1.y + bounds1.height > bounds2.y && bounds1.y < bounds2.y + bounds2.height
    }
    moveLeft() {
        if (!this.hanging) {
            this.vx -= 5
            this.vx = Math.max(this.vx, -this.maxSpeed)
        } else if (this.vx > 0) {
            this.vx = -this.wallSlideSpeed
        }
    }
    moveRight() {
        if (!this.hanging) {
            this.vx += 5
            this.vx = Math.min(this.vx, this.maxSpeed)
        } else if (this.vx < 0) {
            this.vx = this.wallSlideSpeed
        }
    }
    jump() {
        if (this.sprite.y >= this.windowHeightDummy) {
            this.vy = -this.jumpSpeed
            this.hanging = false
        }
    }
    resetSpeed() {
        this.vx = 0
        this.vy = 0
    }
    playAnimation(type: TextureTypes) {
        this.sprite.textures = this.textures[type]
        this.sprite.animationSpeed = this.animationSpeed;
        this.sprite.play()
      }
    stopAnimation() {
        this.sprite.stop()
    }
    update(entities: Entity[], delta: number) {
        if (this.name === 'player') console.dir(delta)
        this.sprite.x += this.vx
        this.sprite.y += this.vy
        this.vy += this.gravity
        if (this.sprite.y > this.windowHeightDummy - 1) {
            this.sprite.y = this.windowHeightDummy
            this.vy = 0
            this.hanging = false
        }
        if (this.sprite.x < 0) {
            this.sprite.x = 0
            if (this.vx < 0) {
                this.vy = this.wallSlideSpeed
                this.updateWallSlideSpeed()
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1
            }
        } else if (this.sprite.x + this.size > window.innerWidth) {
            this.sprite.x = window.innerWidth - this.size
            if (this.vx > 0) {
                this.vy = this.wallSlideSpeed
                this.updateWallSlideSpeed()
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1
            }
        } else {
            this.wallSlideSpeed = 1
            this.hanging = false
        }
        this.vx *= this.drag
        this.checkForCollisions(entities)
    }
    private updateWallSlideSpeed() {
        this.wallSlideSpeed *= 0.9
        if (this.wallSlideSpeed < this.minWallSlideSpeed) {
            this.wallSlideSpeed = 0
        }
    }
    wallJump() {
        if (this.hanging) {
            this.vy = -this.jumpSpeed
            this.vx = this.vx * -1.5
            this.hanging = false
        }
    }
}
