import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../shared/engine"
import { wall } from "../shared/entities/templates-entity"
import { MovementSystemTB } from "../shared/systems/movement-tb"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { CreateEntity, EntityMap } from "./../shared/entities/create-entity"
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
        this.world.addEntity(this.player)
        this.createBounds(this.world)

        this.world.addSystem(new MovementSystemTB(this.world) as MovementSystemTB)

        // you will need to set this when creating the world
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)

        // allow for turn based movement
        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }

    addCanvas(elementRef: HTMLElement ) { 
        if (this.running.value) this.world.addSystem(new RenderSystem(this.world))
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    onKeyChange(data: any): void {
        const { key, isDown } = data
        if (isDown) this.shifting.value = true
    }

    update(delta: number) {
        // if (!this.paused.value && this.running.value) console.log('render some glyphs')
        if (!this.paused.value && this.running.value && this.shifting.value) this.world.update(delta)
    }

    // Temp
    createBounds(world: World): void {
        const { worldDimensions } = world
        // floor
        this.setBounds(wall, 0, worldDimensions.y - world.wallSize, worldDimensions.x, world.wallSize)
        world.addEntity(CreateEntity(wall, world))
        // leftWall
        this.setBounds(wall, 0, world.wallSize, world.wallSize, worldDimensions.y - (world.wallSize * 2))
        world.addEntity(CreateEntity(wall, world))
        // rightWall
        this.setBounds(wall, worldDimensions.x - world.wallSize, world.wallSize, world.wallSize, worldDimensions.y - (world.wallSize * 2))
        world.addEntity(CreateEntity(wall, world))
        // ceiling
        this.setBounds(wall, 0, 0, worldDimensions.x, world.wallSize)
        world.addEntity(CreateEntity(wall, world))
    }
    
    setBounds(entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void {
        const { position, size } = entity.options
        position.x = positionX
        position.y = positionY
        size.x = sizeX
        size.y = sizeY
    }


}
