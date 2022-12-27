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

  public getUser() {
    const user = this.get(Locals.Game_USER)
    const result = user ? JSON.parse(user) : undefined
    return result
  }

  public setUser(user: string) {
    this.set(Locals.Game_USER, JSON.stringify(user))
  }

  public clear() {
    this.clearItems([Locals.Game_USER])
  }
}
