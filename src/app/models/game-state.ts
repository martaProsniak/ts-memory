export class GameState {
    oneVisible: boolean
    turnCounter: number
    visibleNr: number
    lock: boolean
    pairsLeft: number
    
    constructor() {
        this.oneVisible = false
        this.turnCounter = 0
        this.visibleNr = null
        this.lock = false
        this.pairsLeft = 6
    }
}
