import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../shared/engine"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { demoWorld, secondWorld, startWorld } from "./util/templates-world"

export class CropLikeModule extends Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    name = 'Croplike'

    constructor(run?: boolean) {
        // set app
        super(run)

        this.worldIndex = 2
        this.worlds = [demoWorld, secondWorld, startWorld]
        this.switchWorld(this.worldIndex)
    }

    update(delta: number) {
        if (!this.paused && this.running) this.world.update(delta)
    }

}
