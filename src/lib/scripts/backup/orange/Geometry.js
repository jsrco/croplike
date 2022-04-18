class Geometry {
        getLine(startX, startY, endX, endY) {
            let points = [];
            let dx = Math.abs(endX - startX);
            let dy = Math.abs(endY - startY);
            let sx = (startX < endX) ? 1 : -1;
            let sy = (startY < endY) ? 1 : -1;
            let err = dx - dy;
            let e2;
    
            while (true) {
                points.push({x: startX, y: startY});
                if (startX === endX && startY === endY) {
                    break;
                }
                e2 = err * 2;
                if (e2 > -dx) {
                    err -= dy;
                    startX += sx;
                }
                if (e2 < dx){
                    err += dx;
                    startY += sy;
                }
            }
    
            return points;
        }   
}

export default Geometry
