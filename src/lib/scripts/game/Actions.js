import Game from "$lib/stores/gameStore";
import Metrics from "$lib/stores/metricStore";
import Utility from "./Utility";

const Actions = {
    move(entity, dx, dy, d, inputType) {
        // Looking will not add to engine for now
        if (entity.facing !== d) {
            entity.facing = d;
            inputType === 0
                ? Metrics.addTotalKeyboardEvents()
                : Metrics.addTotalMouseEvents()
            Game.engineRender();
        } else {
            // Check Reaction
            if (entity.tryMove(dx, dy)) {
                // Console Logging
                inputType === 0
                    ? Metrics.addTotalKeyboardEvents()
                    : Metrics.addTotalMouseEvents()
                Metrics.addTotalMoves(); // Total Moves Tracking
                Metrics.addConsole(
                    "you moved: " + Utility.returnDirection(dx, dy)
                )
                Game.engineUnlock("move");
            } else Metrics.addDebug("tried to move, did not work"); // Error Logging
        }
    },
};

export default Actions;
