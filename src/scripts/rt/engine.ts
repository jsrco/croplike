import RAPIER from "@dimforge/rapier2d"
import useEngine from "../../composeables/use-engine"
import { Engine } from "../shared/engine"
import { EntityMap } from "../shared/entities/create-entity"
import { Entity } from '../shared/entities/entity'
import { WorldMap } from "../shared/util/create-world"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { CreateWorld } from "./util/create-world"
import { demoWorld, secondWorld, startWorld } from "./util/templates-world"

export class CropLikeModule extends Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    name = 'Croplike'

    worlds: Array<WorldMap>

    constructor(run?: boolean) {
        // set app
        super(run)

        this.worldIndex = 2
        this.worlds = [demoWorld, secondWorld, startWorld]
        this.switchWorld(this.worldIndex)

        window.addEventListener('keydown', (event) => {
            if (event.key === 'l' && this.running === true) {
                useEngine().activeModule.value.load()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 's' && this.running === true) {
                useEngine().activeModule.value.save()
            }
        })
    }

    load(): void {
        const saveData: any = this.localStorageManager.getData()
        if (Object.keys(saveData).length !== 0) {
            this.paused = true
            this.worldIndex = saveData.world
            this.worlds = []
            this.worlds = saveData.worlds
            this.app.stage.removeChildren()
            this.switchWorld(this.worldIndex)
            this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)
        } else console.log('no saved data')
    }

    switchEntityToWorld(targetIndex: number, targetEntity: Entity): void {
        const entities = this.worlds[this.worldIndex].entities
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index]
            if (entity.id === targetEntity.id) {
                entities.splice(index, 1)
                break
            }
        }
        const entityInfo = this.saveManager.createEntityMap(targetEntity)
        this.worlds[targetIndex].entities.push(entityInfo as EntityMap)
    }

    switchWorld(targetIndex: number, targetEntity?: Entity): void {
        this.paused = true
        if (this.world && targetEntity) {
            this.world.removeEntity(targetEntity)
        }
        this.app.stage.removeChildren()
        if (targetEntity) {
            this.switchEntityToWorld(targetIndex, targetEntity)
        }
        this.world = CreateWorld(this, this.worlds[targetIndex])
        this.worldIndex = targetIndex
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)
        this.pause()
    }

    update(delta: number) {
        if (!this.paused && this.running) this.world.update(delta)
    }

}
