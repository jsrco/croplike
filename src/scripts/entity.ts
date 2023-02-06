export class Entity {
    drag: number = 0.95
    gravity: number = 0.7
    hanging: boolean = false
    jumpSpeed: number = 9
    maxSpeed: number = 12
    minWallSlideSpeed: number = 0.1
    name: string
    size: number = 55
    square: any
    vx: number = 0
    vy: number = 0
    wallSlideSpeed: number = 2
    windowHeightDummy: number
    constructor(square: any, name: string) {
        this.name = name
        this.square = square
        this.windowHeightDummy = window.innerHeight - 36 - this.size
    }
    private checkForCollisions(entities: Entity[]) {
        for (const entity of entities) {
            if (entity === this) continue
            if (this.isCollidingWith(entity)) {
                // handle collision with entity
                console.log(this.name + ' collided with ' + entity.name)
    
                if (this.name === 'player') {
                    const xDiff = (this.square.x + this.size/2) - (entity.square.x + entity.size/2)
                    const yDiff = (this.square.y + this.size/2) - (entity.square.y + entity.size/2)
    
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            entity.square.x -= 1
                        } else {
                            entity.square.x += 1
                        }
                    } else {
                        if (yDiff > 0) {
                            entity.square.y -= 1
                        } else {
                            entity.square.y += 1
                        }
                    }
                }
            }
        }
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
