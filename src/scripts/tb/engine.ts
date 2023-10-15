import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../shared/engine"
import { createBounds } from "../shared/util/create-world"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { PixiComponent } from "./../shared/components/pixi"
import { CreateEntity } from "./../shared/entities/create-entity"
import { Entity } from "./../shared/entities/entity"
import { RenderSystem } from "./../shared/systems/render"
import { World } from "./../shared/util/world"
import { player } from "./entities/templates-entity"

export class FieldsModule extends Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name: String = 'Fields'
    world: World = new World(this, { worldDimensions: this.appDimensions } )

    player: Entity

    constructor(run?:boolean) {
        // set app
        super(run)

        this.player = CreateEntity(player , this.world)
        const pixiComponent = this.player.getComponent('pixi') as PixiComponent
        pixiComponent.setPosition(player.options.position)
        this.world.addEntity(this.player)

        createBounds(this.world)
        // you will need to set this when creating the world
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)
    }

    addCanvas(elementRef: HTMLElement ) { 
        if (this.running.value) this.world.addSystem(new RenderSystem(this.world))
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    update(delta: number) {
        // if (!this.paused.value && this.running.value) console.log('render some glyphs')
        if (!this.paused.value && this.running.value) this.world.update(delta)
    }

}
