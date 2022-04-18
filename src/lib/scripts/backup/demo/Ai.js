
import Metrics from "$lib/stores/metricStore";

class Ai {
    constructor(entity) {
        // Pass access to the entity for this.
        this.entity = entity
    }
    act() {
        // AI Actions go here. 
        Metrics.addConsole("AI acts: BIG TODD")
    }
}

export default Ai;
