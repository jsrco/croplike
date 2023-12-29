export const extend = (src, dest) => {
  const result = {}
  for (const key in src) {
      result[key] = src[key]
  }
  for (const key in dest) {
      result[key] = dest[key]
  }
  return result
}

export const geometry = {
  getLine(startX, startY, endX, endY) {
      const points = []
      const dx = Math.abs(endX - startX)
      const dy = Math.abs(endY - startY)
      const sx = (startX < endX) ? 1 : -1
      const sy = (startY < endY) ? 1 : -1
      let err = dx - dy
      let e2

      // eslint-disable-next-line no-constant-condition
      while (true) {
          points.push({x: startX, y: startY})
          if (startX == endX && startY == endY) break
          e2 = err * 2
          if (e2 > -dx) {
              err -= dy
              startX += sx
          }
          if (e2 < dx){
              err += dx
              startY += sy
          }
      }
      return points
  }
}
export const getNeighborPositions = (x: number, y: number) => {
  const tiles = []
  for (let dX = -1; dX < 2; dX++) {
    for (let dY = -1; dY < 2; dY++) {
      if (dX == 0 && dY == 0) {
        continue
      }
      tiles.push({ x: x + dX, y: y + dY })
    }
  }
  return randomize(tiles)
}
export const randomize = (arr: any[]): Array<any[]> => {
  let t, j
  const ret = arr.slice(0)
  let i = ret.length
  while (--i > 0) {
    t = ret[(j = Math.round(Math.random() * i))]
    ret[j] = ret[i]
    ret[i] = t
  }
  return ret
}
export const sendMessage = (recipient: any, message: string) => {
  if (recipient.hasMixin('MessageRecipient')) {
      recipient.receiveMessage(message);
  }
}
export const sendMessageNearby = (map: any, centerX: number, centerY: number, centerZ: number, message: string) => {
  const entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5)
  for (let i = 0; i < entities.length; i++) {
      if (entities[i].hasMixin('MessageRecipient')) {
          entities[i].receiveMessage(message)
      }
  }
}
export const setPosition = (target, x: number, y: number, z: number) => {
  const oldX = target.x
  const oldY = target.y
  const oldZ = target.z
  target.x = x
  target.y = y
  target.z = z
  if (target.map) {
    target.map.updateEntityPosition(target, oldX, oldY, oldZ)
  }
}