export class Entity {
    drag: number
    gravity: number
    hanging: boolean
    jumpSpeed: number
    maxSpeed: number
    minWallSlideSpeed: number
    size: number
    square: any
    vx: number
    vy: number
    wallSlideSpeed: number
    windowHeightDummy:number
    constructor(square: any) {
        this.drag = 0.95
        this.gravity = 0.7
        this.hanging = false
        this.jumpSpeed = 9
        this.maxSpeed = 12
        this.minWallSlideSpeed = 0.1
        this.size = 55
        this.square = square
        this.vx = 0
        this.vy = 0
        this.wallSlideSpeed = 2
        this.windowHeightDummy = window.innerHeight - 36 - this.size

    }
    moveLeft() {
        if (!this.hanging) {
            this.vx -= 5;
            if (this.vx < -this.maxSpeed) {
                this.vx = -this.maxSpeed
            }
        } else if (this.vx > 0) {
            this.vx = -this.wallSlideSpeed;
        }
    }
    moveRight() {
        if (!this.hanging) {
            this.vx += 5;
            if (this.vx > this.maxSpeed) {
                this.vx = this.maxSpeed
            }
        } else if (this.vx < 0) {
            this.vx = this.wallSlideSpeed;
        }
    }
    jump() {
        if (this.square.y === this.windowHeightDummy) {
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
    update() {
        this.square.x += this.vx
        this.square.y += this.vy
        this.vy += this.gravity
        if (this.square.y > this.windowHeightDummy -1) {
            this.square.y = this.windowHeightDummy
            this.vy = 0
            this.hanging = false
        }
        if (this.square.x < 0) {
            this.square.x = 0;
            if (this.vx < 0) {
                this.vy = this.wallSlideSpeed;
                this.wallSlideSpeed *= 0.9;
                if (this.wallSlideSpeed < this.minWallSlideSpeed) {
                    this.wallSlideSpeed = 0;
                }
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1;
            }
        } else if (this.square.x + this.size > window.innerWidth) {
            this.square.x = window.innerWidth - this.size
            if (this.vx > 0) {
                this.vy = this.wallSlideSpeed
                this.wallSlideSpeed *= 0.9
                if (this.wallSlideSpeed < this.minWallSlideSpeed) {
                    this.wallSlideSpeed = 0
                }
                this.hanging = true
            } else {
                this.wallSlideSpeed = 1
            }
        } else {
            this.wallSlideSpeed = 1
            this.hanging = false
        }
      
        this.vx *= this.drag
    }
}