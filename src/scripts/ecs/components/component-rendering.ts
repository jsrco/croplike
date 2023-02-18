import * as PIXI from 'pixi.js'
import { Component } from './component'

export class RenderingComponent extends Component {
    sprite: PIXI.AnimatedSprite
  
    constructor(animationFrames: PIXI.Texture[], animationSpeed: number) {
      super("rendering")
      this.sprite = new PIXI.AnimatedSprite(animationFrames)
      this.sprite.animationSpeed = animationSpeed
      this.sprite.play()
    }
  
    update(delta: number) {
      // No implementation needed for this component
    }
  }