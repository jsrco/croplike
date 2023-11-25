import { EntityMap } from "../entities/create-entity"
import { Entity } from "../entities/entity"
import { PhysicsSystem } from "../systems/physics"
import { SystemMap, WorldMap } from "./create-world"
import { World } from "./world"

export class SaveManager {

    data: {
        world: number
        worlds: Array<WorldMap>
    }
    constructor() {
        this.data = {
            world: 0,
            worlds: []
        }
    }

    clearData(): void {
        this.data = {
            world: 0,
            worlds: []
        }
    }

    createEntityMap(entity: Entity): EntityMap | undefined {
        if (entity.name !== 'ceiling' && entity.name !== 'floor' && entity.name !== 'leftWall' && entity.name !== 'rightWall') {
            const entityMap: any = {
                id: entity.id,
                name: entity.name,
                componentMap: {},
                options: {},
            }
            for (const compontent in entity.components) {
                const targetComponent = entity.components[compontent]
                entityMap.componentMap[targetComponent.type] = true
                entityMap.options = {
                    ...entityMap.options,
                    ...targetComponent.copyComponentData(targetComponent)
                }
            }
            // Adjust for on save / load, Rapier RigidBody starting from the center of the collider
            const physicsSystem = entity.components['position'].world.getSystemByType('physics') as PhysicsSystem
            if (physicsSystem) {
                entityMap.options.position.x += (entityMap.options.size.x / 2)
                entityMap.options.position.y += (entityMap.options.size.y / 2)
            }
            return entityMap
        }
    }

    createWorldMap(world: World): WorldMap {
        let worldData: WorldMap = {
            entities: [],
            worldDimensions: { x: 0, y: 0 },
            systemMap: {
                movementRT: false,
                movementTB: false,
                physics: false,
                render: false
            }
        }
        const { entities, worldDimensions } = world
        for (const entity in entities) {
            const data = this.createEntityMap(entities[entity])
            if (data) worldData.entities.push(data)
        }
        worldData.worldDimensions = worldDimensions
        worldData.systemMap = this.createSystemsMap(world)
        return worldData
    }

    createSystemsMap(world: World): SystemMap {
        const systemMap = {
            movementRT: false,
            movementTB: false,
            physics: false,
            render: false,
        }
        if (world.getSystemByType('movement-RT')) systemMap.movementRT = true
        if (world.getSystemByType('movement-TB')) systemMap.movementTB = true
        if (world.getSystemByType('physics')) systemMap.physics = true
        if (world.getSystemByType('render')) systemMap.render = true
        return systemMap
    }

    getData() {
        return this.data
    }

    setData(world: number, worlds: Array<WorldMap>): void {
        this.data.world = world
        this.data.worlds = worlds
    }

}
