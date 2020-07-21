export class GameState {
  score: number = 0;
  maxTurnCount: number = 10;
  visibleCardIndex: number = -1;
  gameLock: boolean = false;
  pairsCount: number;
  deck: string[] = [
    "../../assets/img/rocket.png",
    "../../assets/img/rocket.png",
    "../../assets/img/sun.png",
    "../../assets/img/sun.png",
    "../../assets/img/blaster.png",
    "../../assets/img/blaster.png",
    "../../assets/img/astronaut.png",
    "../../assets/img/astronaut.png",
    "../../assets/img/moon.png",
    "../../assets/img/moon.png",
    "../../assets/img/earth.png",
    "../../assets/img/earth.png"
  ];

  constructor() {
    this.deck = this.shuffleCards(this.deck);
    this.pairsCount = this.deck.length / 2;
  }

  shuffleCards(deck: string[]): string[] {
    const getRandom = (floor: number, ceiling: number) => {
      return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
    }
    // if it's 1 or 0 items, just return
    if (deck.length <= 1) return deck;

    // For each index in deck
    for (let i = 0; i < deck.length; i++) {
      const randomChoiceIndex = getRandom(i, deck.length - 1);
      // place our random choice in the spot by swapping
      [deck[i], deck[randomChoiceIndex]] = [deck[randomChoiceIndex], deck[i]];

    }
    return deck;
  }

  increaseScore() {
    this.score++;
  }

  isMatch(currentReveal: string) {
    return this.deck[this.visibleCardIndex] === currentReveal;
  }

  calculateMaxTurnCount(isMatch: boolean) {
    if (!isMatch) {
      this.maxTurnCount--;
    }
  }

  resetVisibleCard() {
    this.visibleCardIndex = -1;
  }

  lockGame() {
    this.gameLock = true;
  }

  unlockGame() {
    this.gameLock = false;
  }
}
