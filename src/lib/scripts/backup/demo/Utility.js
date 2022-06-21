const Utility = {
  returnDirection(x, y) {
    if (x === 0 && y === -1) return "North";
    if (x === 1 && y === -1) return "North East";
    if (x === 1 && y === 0) return "East";
    if (x === 1 && y === 1) return "South East";
    if (x === 0 && y === 1) return "South";
    if (x === -1 && y === 1) return "South West";
    if (x === -1 && y === 0) return "West";
    if (x === -1 && y === -1) return "North West";
    if (x === 0 && y === 0) return "Waited";
  }
};

export default Utility;
