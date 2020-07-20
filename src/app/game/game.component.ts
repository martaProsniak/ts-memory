import { Component, OnInit } from '@angular/core';
import { Cards } from './cards';
import { GameState } from './gameState';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  cards: string[] = [];
  cardBack: string = '../../assets/img/alien.png';
  gameState: GameState;
  bestScore: number;
  hiddenClass: string = 'card--matched';

  ngOnInit(): void {
    this.startGame();
  }

  startGame() {
    this.gameState = new GameState();
  }

  revealCard(currentCard: number) {
    const cardElement = this.getCardElement(currentCard);
    const currentImage = this.gameState.deck[currentCard];
    cardElement.style.backgroundImage = `url(${currentImage})`;

    if (this.gameState.visibleCardIndex < 0) {
      this.gameState.visibleCardIndex = currentCard;
    } else {
      this.handlePairReveal(currentCard);
    }
  }

  handlePairReveal(currentCard: number) {
    const currentImage = this.gameState.deck[currentCard];
    const pair = [this.getCardElement(currentCard), this.getCardElement(this.gameState.visibleCardIndex)];
    const isMatch = this.gameState.isMatch(currentImage);

    if (isMatch) {
      this.handleMatch(pair);
    } else this.handleFail(pair);

    this.gameState.resetVisibleCard();
    this.gameState.calculateMaxTurnCount(isMatch);
    this.gameState.increaseScore();
  }

  handleMatch(cardsArray: HTMLDivElement[]) {
    setTimeout(() => {
      cardsArray.forEach((card) => card.classList.add(this.hiddenClass));
    }, 1000);
  }

  handleFail(cardsArray: HTMLDivElement[]) {
    setTimeout(() => {
      cardsArray.forEach((card) => card.style.backgroundImage = `url(${this.cardBack})`);
    }, 1000);
  }

  getCardElement(index: number): HTMLDivElement {
    return <HTMLDivElement >document.getElementById(`card${index}`);
  }
}
