export function drawMap(grid, ctx, canvas, pxRatio) {
    const colors = ['yellow', 'green']
    let cellSize = grid.cellSize || 10
    let x
    let y
    const xOffset = grid.xOffset
    const yOffset = grid.yOffset

    pxRatio = pxRatio || 1;
    cellSize = cellSize * pxRatio;

    grid.cells.forEach(function (cell) {
        ctx.fillStyle = colors[cell.type] || 'white';
        x = cell.x * cellSize + xOffset * pxRatio;
        y = cell.y * cellSize + yOffset * pxRatio;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x, y, cellSize, cellSize);
    });

    if (grid.selectedCellIndex > -1) {
        ctx.strokeStyle = 'red';
        const cell = grid.cells[grid.selectedCellIndex];
        const x = cell.x * cellSize + xOffset * pxRatio;
        y = cell.y * cellSize + yOffset * pxRatio;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, cellSize, cellSize);
    }
}