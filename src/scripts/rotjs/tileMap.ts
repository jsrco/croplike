const spriteSize = 18
export const TileMap: {
    [key: string]: [number, number];
} = {
    '0Thick': [0, 0],
    '1Thick': [spriteSize * 1, 0],
    '2Thick': [spriteSize * 2, 0],
    '3Thick': [spriteSize * 3, 0],
    '4Thick': [spriteSize * 4, 0],
    '5Thick': [spriteSize * 5, 0],
    '6Thick': [spriteSize * 6, 0],
    '7Thick': [spriteSize * 7, 0],
    '8Thick': [spriteSize * 8, 0],
    '9Thick': [spriteSize * 9, 0],
    '+': [spriteSize * 10, 0],
    '-': [spriteSize * 11, 0],
    '*': [spriteSize * 12, 0],
    '/': [spriteSize * 13, 0],
    '=': [spriteSize * 14, 0],
    '<': [spriteSize * 15, 0],
    '>': [spriteSize * 16, 0],
    '%': [spriteSize * 17, 0],
    'pi': [spriteSize * 18, 0],
    '!': [spriteSize * 19, 0],
    '^': [spriteSize * 20, 0],
    '0': [spriteSize * 21, 0],
    '1': [spriteSize * 22, 0],
    '2': [spriteSize * 23, 0],
    '3': [spriteSize * 24, 0],
    '4': [spriteSize * 25, 0],
    '5': [spriteSize * 26, 0],
    '6': [spriteSize * 27, 0],
    '7': [spriteSize * 28, 0],
    '8': [spriteSize * 29, 0],
    '9': [spriteSize * 30, 0],
    '_': [spriteSize * 31, 0],
    'aThick': [spriteSize * 0, 1 * spriteSize],
    'bThick': [spriteSize * 1, 1 * spriteSize],
    'cThick': [spriteSize * 2, 1 * spriteSize],
    'dThick': [spriteSize * 3, 1 * spriteSize],
    'eThick': [spriteSize * 4, 1 * spriteSize],
    'fThick': [spriteSize * 5, 1 * spriteSize],
    'gThick': [spriteSize * 6, 1 * spriteSize],
    'hThick': [spriteSize * 7, 1 * spriteSize],
    'iThick': [spriteSize * 8, 1 * spriteSize],
    'jThick': [spriteSize * 9, 1 * spriteSize],
    'kThick': [spriteSize * 10, 1 * spriteSize],
    'lThick': [spriteSize * 11, 1 * spriteSize],
    'mThick': [spriteSize * 12, 1 * spriteSize],
    'nThick': [spriteSize * 13, 1 * spriteSize],
    'oThick': [spriteSize * 14, 1 * spriteSize],
    'pThick': [spriteSize * 15, 1 * spriteSize],
    'qThick': [spriteSize * 16, 1 * spriteSize],
    'rThick': [spriteSize * 17, 1 * spriteSize],
    'sThick': [spriteSize * 18, 1 * spriteSize],
    'tThick': [spriteSize * 19, 1 * spriteSize],
    'uThick': [spriteSize * 20, 1 * spriteSize],
    'vThick': [spriteSize * 21, 1 * spriteSize],
    'wThick': [spriteSize * 22, 1 * spriteSize],
    'xThick': [spriteSize * 23, 1 * spriteSize],
    'yThick': [spriteSize * 24, 1 * spriteSize],
    'zThick': [spriteSize * 25, 1 * spriteSize],
    'solid': [spriteSize * 26, 1 * spriteSize],
    '?': [spriteSize * 27, 1 * spriteSize],
    '!!': [spriteSize * 29, 1 * spriteSize],
    '"': [spriteSize * 30, 1 * spriteSize],
    'aFull': [spriteSize * 0, 2 * spriteSize],
    'bFull': [spriteSize * 1, 2 * spriteSize],
    'cFull': [spriteSize * 2, 2 * spriteSize],
    'dFull': [spriteSize * 3, 2 * spriteSize],
    'eFull': [spriteSize * 4, 2 * spriteSize],
    'fFull': [spriteSize * 5, 2 * spriteSize],
    'gFull': [spriteSize * 6, 2 * spriteSize],
    'hFull': [spriteSize * 7, 2 * spriteSize],
    'iFull': [spriteSize * 8, 2 * spriteSize],
    'jFull': [spriteSize * 9, 2 * spriteSize],
    'kFull': [spriteSize * 10, 2 * spriteSize],
    'lFull': [spriteSize * 11, 2 * spriteSize],
    'mFull': [spriteSize * 12, 2 * spriteSize],
    'nFull': [spriteSize * 13, 2 * spriteSize],
    'oFull': [spriteSize * 14, 2 * spriteSize],
    'pFull': [spriteSize * 15, 2 * spriteSize],
    'qFull': [spriteSize * 16, 2 * spriteSize],
    'rFull': [spriteSize * 17, 2 * spriteSize],
    'sFull': [spriteSize * 18, 2 * spriteSize],
    'tFull': [spriteSize * 19, 2 * spriteSize],
    'uFull': [spriteSize * 20, 2 * spriteSize],
    'vFull': [spriteSize * 21, 2 * spriteSize],
    'wFull': [spriteSize * 22, 2 * spriteSize],
    'xFull': [spriteSize * 23, 2 * spriteSize],
    'yFull': [spriteSize * 24, 2 * spriteSize],
    'zFull': [spriteSize * 25, 2 * spriteSize],
    '#': [spriteSize * 26, 2 * spriteSize],
    'aFancy': [spriteSize * 0, 3 * spriteSize],
    'bFancy': [spriteSize * 1, 3 * spriteSize],
    'cFancy': [spriteSize * 2, 3 * spriteSize],
    'dFancy': [spriteSize * 3, 3 * spriteSize],
    'eFancy': [spriteSize * 4, 3 * spriteSize],
    'fFancy': [spriteSize * 5, 3 * spriteSize],
    'gFancy': [spriteSize * 6, 3 * spriteSize],
    'hFancy': [spriteSize * 7, 3 * spriteSize],
    'iFancy': [spriteSize * 8, 3 * spriteSize],
    'jFancy': [spriteSize * 9, 3 * spriteSize],
    'kFancy': [spriteSize * 10, 3 * spriteSize],
    'lFancy': [spriteSize * 11, 3 * spriteSize],
    'mFancy': [spriteSize * 12, 3 * spriteSize],
    'nFancy': [spriteSize * 13, 3 * spriteSize],
    'oFancy': [spriteSize * 14, 3 * spriteSize],
    'pFancy': [spriteSize * 15, 3 * spriteSize],
    'qFancy': [spriteSize * 16, 3 * spriteSize],
    'rFancy': [spriteSize * 17, 3 * spriteSize],
    'sFancy': [spriteSize * 18, 3 * spriteSize],
    'tFancy': [spriteSize * 19, 3 * spriteSize],
    'uFancy': [spriteSize * 20, 3 * spriteSize],
    'vFancy': [spriteSize * 21, 3 * spriteSize],
    'wFancy': [spriteSize * 22, 3 * spriteSize],
    'xFancy': [spriteSize * 23, 3 * spriteSize],
    'yFancy': [spriteSize * 24, 3 * spriteSize],
    'zFancy': [spriteSize * 25, 3 * spriteSize],
    'a': [spriteSize * 0, 4 * spriteSize],
    'b': [spriteSize * 1, 4 * spriteSize],
    'c': [spriteSize * 2, 4 * spriteSize],
    'd': [spriteSize * 3, 4 * spriteSize],
    'e': [spriteSize * 4, 4 * spriteSize],
    'f': [spriteSize * 5, 4 * spriteSize],
    'g': [spriteSize * 6, 4 * spriteSize],
    'h': [spriteSize * 7, 4 * spriteSize],
    'i': [spriteSize * 8, 4 * spriteSize],
    'j': [spriteSize * 9, 4 * spriteSize],
    'k': [spriteSize * 10, 4 * spriteSize],
    'l': [spriteSize * 11, 4 * spriteSize],
    'm': [spriteSize * 12, 4 * spriteSize],
    'n': [spriteSize * 13, 4 * spriteSize],
    'o': [spriteSize * 14, 4 * spriteSize],
    'p': [spriteSize * 15, 4 * spriteSize],
    'q': [spriteSize * 16, 4 * spriteSize],
    'r': [spriteSize * 17, 4 * spriteSize],
    's': [spriteSize * 18, 4 * spriteSize],
    't': [spriteSize * 19, 4 * spriteSize],
    'u': [spriteSize * 20, 4 * spriteSize],
    'v': [spriteSize * 21, 4 * spriteSize],
    'w': [spriteSize * 22, 4 * spriteSize],
    'x': [spriteSize * 23, 4 * spriteSize],
    'y': [spriteSize * 24, 4 * spriteSize],
    'z': [spriteSize * 25, 4 * spriteSize],
    'A': [spriteSize * 0, 5 * spriteSize],
    'B': [spriteSize * 1, 5 * spriteSize],
    'C': [spriteSize * 2, 5 * spriteSize],
    'D': [spriteSize * 3, 5 * spriteSize],
    'E': [spriteSize * 4, 5 * spriteSize],
    'F': [spriteSize * 5, 5 * spriteSize],
    'G': [spriteSize * 6, 5 * spriteSize],
    'H': [spriteSize * 7, 5 * spriteSize],
    'I': [spriteSize * 8, 5 * spriteSize],
    'J': [spriteSize * 9, 5 * spriteSize],
    'K': [spriteSize * 10, 5 * spriteSize],
    'L': [spriteSize * 11, 5 * spriteSize],
    'M': [spriteSize * 12, 5 * spriteSize],
    'N': [spriteSize * 13, 5 * spriteSize],
    'O': [spriteSize * 14, 5 * spriteSize],
    'P': [spriteSize * 15, 5 * spriteSize],
    'Q': [spriteSize * 16, 5 * spriteSize],
    'R': [spriteSize * 17, 5 * spriteSize],
    'S': [spriteSize * 18, 5 * spriteSize],
    'T': [spriteSize * 19, 5 * spriteSize],
    'U': [spriteSize * 20, 5 * spriteSize],
    'V': [spriteSize * 21, 5 * spriteSize],
    'W': [spriteSize * 22, 5 * spriteSize],
    'X': [spriteSize * 23, 5 * spriteSize],
    'Y': [spriteSize * 24, 5 * spriteSize],
    'Z': [spriteSize * 25, 5 * spriteSize],
    // Future Content
    '@': [spriteSize * 15, 12 * spriteSize],
    'skull': [spriteSize * 13, 6 * spriteSize],
    '.': [spriteSize * 17, 14 * spriteSize],
    'shield': [spriteSize * 19, 6 * spriteSize],
    'sword': [spriteSize * 20, 6 * spriteSize],
    ' ': [spriteSize * 31, 15 * spriteSize],
    ':': [spriteSize * 30, 14 * spriteSize],
    'stairDown': [spriteSize * 3, 7 * spriteSize],
    'stairUp': [spriteSize * 4, 7 * spriteSize],
    'water': [spriteSize*25,7*spriteSize],
    'pcursor' : [spriteSize*11,7*spriteSize]
}