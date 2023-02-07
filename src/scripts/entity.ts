export class Entity {
    drag: number = 0.95
    gravity: number = 0.5
    hanging: boolean = false
    jumpSpeed: number = 4
    maxSpeed: number = 3
    minWallSlideSpeed: number = 0.1
    path: number = 0
    name: string
    size: number = 15
    square: any
    vx: number = 0
    vy: number = 0
    wallSlideSpeed: number = 1
    windowHeightDummy: number = window.innerHeight - 36 - this.size
    constructor(square: any, name: string) {
        this.name = name
        this.square = square
    }
    resetState() {
        this.vx = 0
        this.vy = 0
    }
    private checkForCollisions(entities: Entity[]) {
        for (const entity of entities) {
            if (entity === this) continue
            if (this.isCollidingWith(entity)) {
                if (this.name === 'player') {
                    let angle = Math.atan2(this.square.y - entity.square.y, this.square.x - entity.square.x)
                    let xDistance = Math.cos(angle) * 0.5
                    let yDistance = Math.sin(angle) * 0.5
                    let overlap = this.size + entity.size - this.getDistance(this, entity)
                    entity.square.x += xDistance * overlap
                    entity.square.y += yDistance * overlap
                }
            }
        }
    }
    private getDistance(entity1: Entity, entity2: Entity) {
        let a = entity1.square.x - entity2.square.x
        let b = entity1.square.y - entity2.square.y
        return Math.sqrt(a * a + b * b)
    }
    private isCollidingWith(other: Entity) {
        const x1 = this.square.x
        const y1 = this.square.y
        const x2 = other.square.x
        const y2 = other.square.y
        return x1 < x2 + other.size && x1 + this.size > x2 &&
            y1 < y2 + other.size && y1 + this.size > y2
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
        if (this.square.y >= this.windowHeightDummy) {
            this.vy = -this.jumpSpeed
            this.hanging = false
        }
    }
    wallJump() {
        if (this.hanging) {
            this.vy = -this.jumpSpeed
            this.vx = this.vx * -1.5
            this.hanging = false
        }
    }
    update(entities: Entity[]) {
        this.square.x += this.vx
        this.square.y += this.vy
        this.vy += this.gravity
        if (this.square.y > this.windowHeightDummy - 1) {
            this.square.y = this.windowHeightDummy
            this.vy = 0
            this.hanging = false
        }
        if (this.square.x < 0) {
            this.square.x = 0
            if (this.vx < 0) {
                this.vy = this.wallSlideSpeed
                this.updateWallSlideSpeed()
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1
            }
        } else if (this.square.x + this.size > window.innerWidth) {
            this.square.x = window.innerWidth - this.size
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
}
