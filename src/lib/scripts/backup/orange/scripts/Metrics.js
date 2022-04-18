class Metrics {
  constructor() {
    this.consoleData = [
      "Welcome to Project Orange Movement Demo",
      "This is a WIP",
    ];
    this.debugData = ["All clear..."]; // future me will use this to keep track of t
    this.totalKeyboardEvents = 0;
    this.totalMouseEvents = 0
    this.totalMoves = 0;
  }
  addConsole(str) {
    typeof str === "string"
      ? this.consoleData.push(str)
      : this.debugData.push(str);
  }
  addDebug(err) {
    this.debugData.push(err);
  }
}

export default Metrics;
