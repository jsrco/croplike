


export const map = {

    // CREATE A GRID OBJECT

    // parse grid properties
    parseGridProps(grid) {
        const a = {
            width: grid.width || 64,
            height: grid.height || 16,
            cellSize: grid.cellSize || 32,
            xOffset: grid.xOffset === undefined ? 0 : grid.xOffset,
            yOffset: grid.yOffset === undefined ? 0 : grid.yOffset,
            bufferSize: grid.bufferSize === undefined ? 32 : grid.bufferSize,
            selectedCellIndex: grid.selectedCellIndex || -1,
            cells: []
        }
        return a;
    },

    // make and return a new grid object by just passing width and height values
    createGridObject(w, h) {
        const a = this.parseGridProps({
            width: w,
            height: h
        });
        const grid = this.createClearCellGrid(a);
        grid.ver = '0.0.0';
        return grid;
    },

    // create a new grid object with blank cells by passing a given grid Object
    createClearCellGrid(grid) {
        const a = this.parseGridProps(grid);
        // create clean cells
        let i = 0
        let x
        let y
        const len = a.width * a.height;
        while (i < len) {
            a.cells.push({
                i: i,
                x: i % a.width,
                y: Math.floor(i / a.width),
                type: 0, // type index (0 = sand , 1-5 = grass, 6-10 = wood),
                worth: 0
            });
            i += 1;
        }
        return a;
    },

    // BOUNDS

    // return a set of clamped offset values for the given grid
    clampedOffsets(grid, canvas, pxRatio) {
        canvas = canvas || {
            width: 320,
            height: 120
        };
        pxRatio = pxRatio || 1;
        const w = grid.width * grid.cellSize * pxRatio;
        const h = grid.height * grid.cellSize * pxRatio;
        const bufferSize = grid.bufferSize * pxRatio;
        const xMin = bufferSize * pxRatio;
        const yMin = bufferSize * pxRatio;
        const xMax = (w - canvas.width + bufferSize) * -1;
        const yMax = (h - canvas.height + bufferSize) * -1;
        let x = grid.xOffset;
        let y = grid.yOffset;
        // rules
        x = x > xMin ? xMin : x;
        y = y > yMin ? yMin : y;
        x = x < xMax ? xMax : x;
        y = y < yMax ? yMax : y;
        // return offset values
        return {
            xOffset: x,
            yOffset: y
        };
    },

    // GET CELL

    // get a cell from the given cell position
    get(grid, x, y) {
        if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
            return {};
        }
        return grid.cells[y * grid.width + x];
    },

    // get a cell position by way of a point on a canvas
    getCellPositionFromCanvasPoint(grid, x, y) {
        return {
            x: Math.floor((x - grid.xOffset) / grid.cellSize),
            y: Math.floor((y - grid.yOffset) / grid.cellSize)
        };
    },

    // get a cell position by way of a point on a canvas
    getCellFromCanvasPoint(grid, x, y) {
        const pos = this.getCellPositionFromCanvasPoint(grid, x, y);
        return this.get(grid, pos.x, pos.y);
    },
    // MAP MOVEMENT

    // get a set of deltas
    getPointerMovementDeltas(grid, canvas, px, py) {
        const cx = canvas.width / 2
        const cy = canvas.height / 2
        const a = Math.atan2(py - cy, px - cx)
        let d = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2))
        let per = 0;
        const dMax = canvas.height / 2
        let delta = 0
        d = d >= dMax ? dMax : d;
        per = d / dMax;
        delta = (0.5 + per * 2.5) * -1;
        return {
            x: Math.cos(a) * delta,
            y: Math.sin(a) * delta
        };
    },
}