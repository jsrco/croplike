import { World } from "../util/world"
import { System } from "./system"

export class RenderSystem extends System {

    type: string = 'render'

    constructor(world: World) {
        super(world)

        // Entities
        console.log('adding entities')

        window.addEventListener('resize', () => {
            console.log('resize')
        })
    }

    appendElement(elementRef: any): void {
        elementRef.appendChild(this.world.engine.app.view)
    }

    update(deltaTime: number): void {
        console.log('render some glyphs')      
    }

}

