import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../shared/engine"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { World } from "./../shared/util/world"
import { CreateWorld } from "./util/create-world"
import { startWorld } from "./util/template-world"

export class FieldsModule extends Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name = 'Fields'

    world: World = CreateWorld(this, startWorld)

    constructor(run?: boolean) {
        // set app
        super(run)

        // you will need to set this when creating the world
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)

        // allow for turn based movement
        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }

    onKeyChange(data: any): void {
        const { isDown } = data
        if (isDown) this.shifting = true
    }

    update(delta: number) {
        if (!this.paused && this.running && this.shifting) this.world.update(delta)
    }

}
