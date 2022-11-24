import { Storage, IStorage } from './storage'

export enum Locals {
  Game_POLICY = 'game-policy',
  Game_ROLES = 'game-roles',
}

export class GameStorage extends Storage<Locals> {
  private static instance?: GameStorage

  private constructor(getStorage?: () => IStorage) {
    super(getStorage)
  }

  public static getInstance(getStorage?: () => IStorage) {
    if (!this.instance) {
      this.instance = new GameStorage(getStorage)
    }
    return this.instance
  }

  public getRoles() {
    const roles = this.get(Locals.Game_ROLES)
    const result = roles ? JSON.parse(roles) : []
    return result || []
  }

  public setRoles(gameRoles: string[]) {
    this.set(Locals.Game_ROLES, JSON.stringify(gameRoles))
  }

  public clear() {
    this.clearItems([Locals.Game_POLICY, Locals.Game_ROLES])
  }
}
