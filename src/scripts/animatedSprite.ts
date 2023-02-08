import * as PIXI from 'pixi.js'

class AnimatedCharacter {
    app: any;
    animations: any;
    currentAnimation: null;
    animSprite: null;
    constructor(app: any, animations: any) {
      this.app = app;
      this.animations = animations;
      this.currentAnimation = null;
      this.animSprite = null;
    }
  
    // Load the sprite sheets
    loadSpriteSheets() {
      for (const animation in this.animations) {
        PIXI.Loader.shared.add(animation, this.animations[animation]);
      }
      PIXI.Loader.shared.load(() => this.setup());
    }
  
    // Set up the AnimatedSprite
    setup() {
      // Create the AnimatedSprite
      this.animSprite = new PIXI.AnimatedSprite();
  
      // Add the AnimatedSprite to the stage
      this.app.stage.addChild(this.animSprite);
  
      // Start with the first animation
      this.playAnimation("walk");
    }
  
    // Play a specific animation
    playAnimation(animation) {
      if (this.currentAnimation === animation) {
        return;
      }
  
      // Get the sprite sheet for the specified animation
      const spriteSheet = PIXI.Loader.shared.resources[animation].spritesheet;
  
      // Update the frames of the AnimatedSprite
      this.animSprite.textures = spriteSheet.frames.map(frame => frame.texture);
  
      // Start the animation
      this.animSprite.play();
  
      // Save the current animation
      this.currentAnimation = animation;
    }
  }
  
  // Create an instance of the AnimatedCharacter class
  const animatedCharacter = new AnimatedCharacter(app, {
    walk: "path/to/walk.json",
    run: "path/to/run.json",
    jump: "path/to/jump.json",
    hang: "path/to/hang.json"
  });
  
  // Load the sprite sheets
  animatedCharacter.loadSpriteSheets();
  