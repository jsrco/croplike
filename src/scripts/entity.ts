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
        if (name === 'player') this.scale = { x: 3, y: 3 }
        if (name === 'giant') this.scale = { x: 15, y: 15 }

        this.windowHeightDummy = window.innerHeight - 36 - this.height
    }
    checkEntityCollisions(entities: Entity[]) {
        for (const entity of entities) {
            if (entity === this) {
                continue
            }

            if (this.x + this.width > entity.x && this.x < entity.x + entity.width &&
                this.y + this.height > entity.y && this.y < entity.y + entity.height) {
                // Entities are colliding
                return entity
            }
        }
      
        // No collisions found
        return null
    }
    checkLevelCollisions(levelBoundaries: PIXI.Rectangle) {
        // Check for collisions with left and right boundaries
        if (this.x < levelBoundaries.x) {
            this.x = levelBoundaries.x
            this.vx = 0
        } else if (this.x + this.width > levelBoundaries.x + levelBoundaries.width) {
            this.x = levelBoundaries.x + levelBoundaries.width - this.width
            this.vx = 0
        }
      
        // Check for collisions with top and bottom boundaries
        if (this.y < levelBoundaries.y) {
            this.y = levelBoundaries.y
            this.vy = 0
            this.hanging = false
        } else if (this.y + this.height > levelBoundaries.y + levelBoundaries.height) {
            this.y = levelBoundaries.y + levelBoundaries.height - this.height
            this.vy = 0
            this.hanging = false
        }
    }
    getDistance(entity1: Entity, entity2: Entity) {
        let a = entity1.x - entity2.x
        let b = entity1.y - entity2.y
        return Math.sqrt(a * a + b * b)
    }
    jump() {
        if (this.y >= this.windowHeightDummy) {
            this.vy = -this.jumpSpeed
            this.hanging = false
        }
    }
    handleCollision(otherEntity: Entity) {
        if (this.name === 'player') {
            if (otherEntity.name === 'giant') {
                this.handleGiantCollision(otherEntity)
            } else {
                this.handleDefaultCollision(otherEntity)
            }
        } else if (this.name === 'giant') {
            if (otherEntity.name === 'player') {
                otherEntity.handleGiantCollision(this)
            } else {
                this.handleDefaultCollision(otherEntity)
            }
        } else {
            this.handleDefaultCollision(otherEntity)
        }
    }
    handleDefaultCollision(otherEntity: Entity) {
        // Handle default collision behavior
            if ((this.name === 'player') && otherEntity.name !== 'player' && otherEntity.name !== 'giant' ) {
                let angle = Math.atan2(this.y - otherEntity.y, this.x - otherEntity.x)
                let xDistance = Math.cos(angle) * 0.5
                let yDistance = Math.sin(angle) * 0.5
                let overlap = this.height + otherEntity.height - this.getDistance(this, otherEntity)
                otherEntity.x += xDistance * overlap
                otherEntity.y += yDistance * overlap
            }
    }
    handleGiantCollision(otherEntity: Entity) {
        // Handle collision with giant
        if (this.vy > 0 && this.y + this.height <= otherEntity.y + otherEntity.height * 0.2) {
            this.y = otherEntity.y - this.height
            this.vy = 0
            this.hanging = true
        }
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
    resetSpeed() {
        this.vx = 0
        this.vy = 0
    }
    updateEntity(entities: Entity[]) {
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
        // Replace current texture with approiate animations
        if (this.vx > 0) this.textures = this.texturePack.moveRight
        if (this.vx < 0) this.textures = this.texturePack.moveLeft
        if (Math.abs(this.vx) < 0.3) this.textures = this.texturePack.standing
        if (this.vy < 0) this.textures = this.texturePack.jumping
        if (this.vy > 0 || this.hanging) this.textures = this.texturePack.hangFall

        const otherEntity = this.checkEntityCollisions(entities)
        if (otherEntity) {
            // Handle the collision
            this.handleCollision(otherEntity)
        }

        this.checkLevelCollisions(new PIXI.Rectangle(0,0,window.innerWidth,this.windowHeightDummy + this.height))
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
