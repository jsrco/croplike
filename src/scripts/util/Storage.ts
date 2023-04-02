import { World } from "./World"

// Storage
export interface IStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export abstract class Storage<T extends string> {
  private readonly storage: IStorage

  public constructor(getStorage = (): IStorage => window.localStorage) {
    this.storage = getStorage()
  }
  protected clearItem(key: T): void {
    this.storage.removeItem(key)
  }
  protected clearItems(keys: T[]): void {
    for (const key of keys) {
      this.clearItem(key)
    }
  }
  protected get(key: T): string | null {
    return this.storage.getItem(key)
  }
  protected set(key: T, value: string): void {
    this.storage.setItem(key, value)
  }
}

// Game Storage
export enum Locals {
  Game_USER = 'game-user',
}

export class GameStorage extends Storage<Locals> {
  private static instance?: GameStorage
  private worlds: Array<World>

  private constructor(getStorage?: () => IStorage) {
    super(getStorage)
    this.worlds = []
  }
  public clear(type: Locals) {
    this.clearItem(type)
  }
  public clearAll() {
    this.clearItems([Locals.Game_USER])
    this.worlds = []
  }
  public clearWorld() {
    this.worlds = []
  }
  public static getInstance(getStorage?: () => IStorage) {
    if (!this.instance) {
      this.instance = new GameStorage(getStorage)
    }
    return this.instance
  }
  public getType(type: Locals) {
    const storageType = this.get(type)
    const result = storageType ? JSON.parse(storageType) : undefined
    return result
  }

  public getWorld() {
    return this.worlds[0]
  }
  public setType(type: Locals, data: any) {
    this.set(type, JSON.stringify(data))
  }
  public setWorld(data: any) {
    this.worlds.push(data)
  }
}
