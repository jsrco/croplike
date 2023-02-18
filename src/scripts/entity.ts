import * as PIXI from 'pixi.js'

export class Entity extends PIXI.AnimatedSprite {
    animationSpeed: number = .1
    drag: number = 0.95
    gravity: number = 0.4
    hanging: boolean = false
    isPressingDown: boolean = false
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
            const { x, y, width, height } = entity
            if (x === this.x && y === this.y && width === this.width && height === this.height) {
                continue
            }
            if (this.x + this.width <= x || this.x >= x + width) {
                continue
            }
            if (this.y + this.height <= y || this.y >= y + height) {
                continue
            }
            // Entities are colliding
            return entity
        }
        // No collisions found
        return null
    }
    checkLevelCollisions(bounds: PIXI.Rectangle) {
        const { x, y, width, height } = bounds
        // Check for collisions with left and right boundaries
        const left = this.x < x
        const right = this.x + this.width > x + width
        if (left || right) {
            this.x = left ? x : x + width - this.width
            this.vx = 0
        }
        // Check for collisions with top and bottom boundaries
        const top = this.y < y
        const bottom = this.y + this.height > y + height
        if (top || bottom) {
            this.y = top ? y : y + height - this.height
            this.vy = 0
            this.hanging = false
        }
    }
    getDistance(entity1: Entity, entity2: Entity): number {
        const a = entity1.x - entity2.x
        const b = entity1.y - entity2.y
        return Math.sqrt(a * a + b * b)
    }
    handleCollision(otherEntity: Entity) {
        if (this.name === 'player') {
            if (otherEntity.name === 'giant') {
                this.handleGiantCollision(otherEntity)
            } else {
                this.handleDefaultCollision(otherEntity)
            }
        }
    }
    handleDefaultCollision(otherEntity: Entity) {
        if (this.name !== 'player' || otherEntity.name === 'player' || otherEntity.name === 'giant') {
            return
        }
        const dx = this.x - otherEntity.x
        const dy = this.y - otherEntity.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const overlap = (this.height + otherEntity.height) - distance
        if (overlap > 0) {
            const adjustX = (dx / distance) * overlap * 0.5
            const adjustY = (dy / distance) * overlap * 0.5
            otherEntity.x += adjustX
            otherEntity.y += adjustY
        }
    }
    handleGiantCollision(otherEntity: Entity) {
        const otherEntityPrevX = otherEntity.x - otherEntity.vx
        const otherEntityPrevY = otherEntity.y - otherEntity.vy
        const playerRight = this.x + this.width
        const giantRight = otherEntity.x + otherEntity.width
        const playerLeft = this.x
        const giantLeft = otherEntity.x
        const playerBottom = this.y + this.height
        const giantBottom = otherEntity.y + otherEntity.height
        if (playerRight >= giantRight) {
            // Player is colliding with the right side of the giant
            this.vx = 0
            if (!(this.y + this.height <= otherEntity.y) && !this.isPressingDown) {
                this.hanging = true
                this.vy = 0
                if (otherEntityPrevX > giantRight && this.vx < 0) {
                    // otherEntity is moving away from player horizontally and player is not moving away
                    this.hanging = false
                    this.vy = this.gravity
                }
            }
            this.x = giantRight - 2
        } else if (playerLeft <= giantLeft) {
            // Player is colliding with the left side of the giant
            this.vx = 0
            if (!(this.y + this.height <= otherEntity.y) && !this.isPressingDown) {
                this.hanging = true
                this.vy = 0
                if (otherEntityPrevX < giantLeft && this.vx > 0) {
                    // otherEntity is moving away from player horizontally and player is not moving away
                    this.hanging = false
                    this.vy = this.gravity
                }
            }
            this.x = giantLeft - this.width + 2
        } else if (playerBottom >= giantBottom) {
            // Player is colliding with the bottom of the giant
            this.y = giantBottom - this.height
            this.vy = 0
            if (!this.hanging) {
                this.hanging = true
                if (otherEntityPrevY < giantBottom) {
                    // otherEntity is moving away from player vertically and player is not moving away
                    this.hanging = false
                    this.vy = this.gravity
                }
            }
        } else {
            // Player is colliding with the top of the giant
            this.y = otherEntity.y - this.height
            this.vy = 0
        }
    }
    jump() {
        if (this.hanging) {
            this.vy = -this.jumpSpeed
            this.vx = this.vx * -1.5
            this.hanging = false
        } else if (this.y >= this.windowHeightDummy) {
            this.vy = -this.jumpSpeed
            this.hanging = false
        }
    }
    moveLeft() {
        if (this.hanging) {
            this.vx = Math.max(-this.wallSlideSpeed, this.vx - 5);
        } else {
            this.vx = Math.max(-this.maxSpeed, this.vx - 5);
        }
    }
    moveRight() {
        if (this.hanging) {
            this.vx = Math.min(this.wallSlideSpeed, this.vx + 5);
        } else {
            this.vx = Math.min(this.maxSpeed, this.vx + 5);
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
        if (this.vy < 0) this.textures = this.texturePack.jumping
        if (this.vy > 0 || this.hanging) this.textures = this.texturePack.hangFall
        if (Math.abs(this.vx) < 0.3 && Math.abs(this.vy) < 0.9 && !this.hanging) this.textures = this.texturePack.standing

        const otherEntity = this.checkEntityCollisions(entities)
        if (otherEntity) {
            // Handle the collision
            this.handleCollision(otherEntity)
        }
        this.checkLevelCollisions(new PIXI.Rectangle(0, 0, window.innerWidth, this.windowHeightDummy + this.height))
    }
    updateWallSlideSpeed() {
        this.wallSlideSpeed *= 0.9
        if (this.wallSlideSpeed < this.minWallSlideSpeed) {
            this.wallSlideSpeed = 0
        }
    }
}
