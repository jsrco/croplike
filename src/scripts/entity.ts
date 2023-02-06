export class Entity {
    readonly drag: number = 0.95
    readonly gravity: number = 0.7
    hanging: boolean = false
    readonly jumpSpeed: number = 9
    maxSpeed: number = 12
    readonly minWallSlideSpeed: number = 0.1
    readonly size: number = 55
    square: any
    vx: number = 0
    vy: number = 0
    wallSlideSpeed: number = 2
    readonly windowHeightDummy: number

    constructor(square: any) {
        this.square = square
        this.windowHeightDummy = window.innerHeight - 36 - this.size
    }

    moveLeft() {
        if (!this.hanging) {
            this.vx -= 5
            this.vx = Math.max(this.vx, -this.maxSpeed);
        } else if (this.vx > 0) {
            this.vx = -this.wallSlideSpeed;
        }
    }

    moveRight() {
        if (!this.hanging) {
            this.vx += 5
            this.vx = Math.min(this.vx, this.maxSpeed);
        } else if (this.vx < 0) {
            this.vx = this.wallSlideSpeed;
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

    update() {
        this.square.x += this.vx;
        this.square.y += this.vy;
        this.vy += this.gravity;
        if (this.square.y > this.windowHeightDummy - 1) {
            this.square.y = this.windowHeightDummy;
            this.vy = 0;
            this.hanging = false;
        }
        if (this.square.x < 0) {
            this.square.x = 0;
            if (this.vx < 0) {
                this.vy = this.wallSlideSpeed;
                this.wallSlideSpeed *= 0.9;
                if (this.wallSlideSpeed < this.minWallSlideSpeed) {
                    this.wallSlideSpeed = 0;
                }
                this.hanging = true;
            } else {
                this.wallSlideSpeed = 1;
            }
        } else if (this.square.x + this.size > window.innerWidth) {
            this.square.x = window.innerWidth - this.size;
            if (this.vx > 0) {
                this.vy = this.wallSlideSpeed;
                this.wallSlideSpeed *= 0.9;
                if (this.wallSlideSpeed < this.minWallSlideSpeed) {
                    this.wallSlideSpeed = 0;
                }
                this.hanging = true;
            } else {
                this.wallSlideSpeed = 1;
            }
        } else {
            this.wallSlideSpeed = 1;
            this.hanging = false;
        }
        this.vx *= this.drag;
    }

    private updateWallSlideSpeed() {
        this.wallSlideSpeed *= 0.9
        if (this.wallSlideSpeed < this.minWallSlideSpeed) {
            this.wallSlideSpeed = 0
        }
    }
}
