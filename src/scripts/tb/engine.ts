import RAPIER from "@dimforge/rapier2d"
import { Base } from "../shared/base"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { RenderSystem } from "./systems/render"
import { World } from "./util/world"
import { Entity } from "./entities/entity"
import { CreateEntity, createBounds } from "./entities/create-entity"
import { player } from "./entities/templates-entity"
import { PixiComponent } from "./components/pixi"

export class Engine extends Base {

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
