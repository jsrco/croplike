import { Entity } from "../entities/entity"

export abstract class Component {
  name: string
  owner!: Entity

  constructor(name: string) {
    this.name = name
  }

  abstract update(delta: number): void
}
