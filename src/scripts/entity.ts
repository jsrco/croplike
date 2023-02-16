import * as PIXI from 'pixi.js'

export class Entity extends PIXI.AnimatedSprite {
    animationSpeed: number = .1
    drag: number = 0.95
    gravity: number = 0.4
    hanging: boolean = false
    jumpSpeed: number = 10
    maxSpeed: number = 6
    minWallSlideSpeed: number = 0.1
    path: number = 0
    name: string
    texturePack: any
    vx: number = 0
    vy: number = 0
    wallSlideSpeed: number = 1
    windowHeightDummy: number
    constructor(textures: any, name: string, texturePack: any) {
        super(textures)
        this.name = name
        this.texturePack = texturePack
        console.log(texturePack)
        if (name === 'player') this.scale = {x:3,y:3}
        this.windowHeightDummy =  window.innerHeight - 36 - this.height
    }
    checkForCollisions(entities: Entity[]) {
        let count = 0
        for (const entity of entities) {
            count++
            if (entity === this) continue
            if (this.isCollidingWith(entity)) {
                if (this.name === 'player') {
                    let angle = Math.atan2(this.y - entity.y, this.x - entity.x)
                    let xDistance = Math.cos(angle) * 0.5
                    let yDistance = Math.sin(angle) * 0.5
                    let overlap = this.height + entity.height - this.getDistance(this, entity)
                    entity.x += xDistance * overlap
                    entity.y += yDistance * overlap
                }
            }
        }
    }
    getDistance(entity1: Entity, entity2: Entity) {
        let a = entity1.x - entity2.x
        let b = entity1.y - entity2.y
        return Math.sqrt(a * a + b * b)
    }
    isCollidingWith(other: Entity) {
        // Get the bounds of the first display object
        let bounds1 = this.getBounds()
        // Get the bounds of the second display object
        let bounds2 = other.getBounds()
        const x1 = this.x
        const y1 = this.y
        const x2 = other.x
        const y2 = other.y
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
        if (this.y >= this.windowHeightDummy) {
            this.vy = -this.jumpSpeed
            this.hanging = false
        }
    }
    resetSpeed() {
        this.vx = 0
        this.vy = 0
    }
    updateEntity(entities: Entity[], delta: number) {
        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity
        if (this.y > this.windowHeightDummy - 1) {
            this.y = this.windowHeightDummy
            this.vy = 0
            this.hanging = false
        }
        if (this.x < 0) {
            this.x = 0
            if (this.vx < 0) {
                this.vy = this.wallSlideSpeed
                this.updateWallSlideSpeed()
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1
            }
        } else if (this.x + this.height > window.innerWidth) {
            this.x = window.innerWidth - this.height
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
        if (this.vx > 0) this.textures = this.texturePack.moveRight
        if (this.vx < 0) this.textures = this.texturePack.moveLeft
        if (Math.abs(this.vx) < 0.3) this.textures = this.texturePack.standing
        if (this.vy < 0) this.textures = this.texturePack.jumping
        if (this.vy > 0 || this.hanging) this.textures = this.texturePack.hangFall
        this.checkForCollisions(entities)
        // Replace current texture with approiate animations
    }
    updateWallSlideSpeed() {
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
