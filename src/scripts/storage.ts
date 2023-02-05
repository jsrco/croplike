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

  protected get(key: T): string | null {
    return this.storage.getItem(key)
  }

  protected set(key: T, value: string): void {
    this.storage.setItem(key, value)
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key)
  }

  protected clearItems(keys: T[]): void {
    for (const key of keys) {
      this.clearItem(key)
    }
  }
}

// Game Storage
export enum Locals {
  Game_MAP = 'game-map',
  Game_USER = 'game-user',
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

  public getType(type: Locals) {
    const storageType = this.get(type)
    const result = storageType ? JSON.parse(storageType) : undefined
    return result
  }

  public setType(type: Locals, data: any) {
    this.set(type, JSON.stringify(data))
  }

  public clear(type: Locals) {
    this.clearItem(type)
  }

  public clearAll() {
    this.clearItems([Locals.Game_MAP, Locals.Game_USER])
  }
}
