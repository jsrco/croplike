export class LocalStorageManager<T> {
    localStorageKey: string
    data: T | undefined
    constructor(localStorageKey: string) {
        this.localStorageKey = localStorageKey
        const storedData = localStorage.getItem(this.localStorageKey)
        if (storedData) {
            this.data = JSON.parse(storedData)
        }
    }
    adjustData(data: Partial<T>): void {
        if (!this.data) {
          throw new Error("Data is not loaded");
        }
        this.data = { ...this.data, ...data };
        const serializedData = JSON.stringify(this.data);
        localStorage.setItem(this.localStorageKey, serializedData);
    }
    clearData(): void {
        this.data = undefined
        localStorage.removeItem(this.localStorageKey)
    }
    getData(): T | undefined {
        return this.data
    }
    saveData(data: T): void {
        this.data = data
        const serializedData = JSON.stringify(data)
        localStorage.setItem(this.localStorageKey, serializedData)
    }
}
