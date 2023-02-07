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
    detectCollision(entities: Entity[]) {
        for (const entity of entities) {
            if (entity === this) continue;
            if (this.square.x + this.size >= entity.square.x && this.square.x <= entity.square.x + entity.size
                && this.square.y + this.size >= entity.square.y && this.square.y <= entity.square.y + entity.size) {
                console.log(`Collision detected between ${this.name} and ${entity.name}`)
                break
            }
        }
        if (this.square.x <= 0 || this.square.x + this.size >= window.innerWidth ||
            this.square.y < 0 || this.square.y + this.size > window.innerHeight) {
            console.log('Collision detected with the edge of the map')
        }
    }
    moveLeft() {
        if (!this.hanging) {
            this.vx -= this.maxSpeed;
            this.vx = Math.max(this.vx, -this.maxSpeed)
        } else if (this.vx > 0) {
            this.vx = -this.wallSlideSpeed
        }
    }
    moveRight() {
        if (!this.hanging) {
            this.vx += this.maxSpeed
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
            this.vy = -this.wallJumpSpeed
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
            this.square.x = 0;
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
        this.detectCollision(entities)
    }
    private updateWallSlideSpeed() {
        this.wallSlideSpeed *= 0.9
        if (this.wallSlideSpeed < this.minWallSlideSpeed) {
            this.wallSlideSpeed = this.minWallSlideSpeed
        }
    }
}
