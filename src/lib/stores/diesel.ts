import { writable } from "svelte/store";

const dieselEngine = writable({
    // Start with a locked game
    locked: true,
    // Engine Mechanics
    EngineLock() {

        if (this.locked) console.log(["Game already locked.", "tracking"])
        else this.locked = true;
    },
    EngineUnlock(tracking) {
        if (!this.locked)
            console.log(["Game already unlocked. You should not be trying the action: ", tracking])
        else this.locked = false;
        this.EngineUpdate();
    },
    EngineUpdate() {
        // Handle Reactions to player moves
        this.EngineLock();
    },
    init() {
        // Start Game
    }
});

const Game = {
    subscribe: dieselEngine.subscribe,
    engineUnlock: (str) => {
        dieselEngine.update(self => {
            self.EngineUnlock(str)
            return self
        })
    },
};

export default Game;
