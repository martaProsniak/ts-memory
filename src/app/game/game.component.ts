import { Component, OnInit } from '@angular/core';
import { Cards } from './cards';
import { GameState } from './gameState';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  cards: string[] = [];
  cardBack: string = '../../assets/img/alien.png';
  gameState: GameState;
  hiddenClass: string = 'card--matched';
  isBonus: boolean = false;
  gameLock: boolean = false;
  pairCounter: number = 0;
  isWin: boolean;
  isGameOver: boolean = false;
  isBestScore: boolean;
  bestScore: number = 0;
  isNewBestScore: boolean = false;

  //TODO
  // win/lose messages after game - finish alerts
  // menu buttons
  // music
  // css effects
  // unit tests

  ngOnInit(): void {
    this.startGame();
  }

  restartGame() {
    this.endGame();
    this.startGame();
  }

  getBestScore() {
    const localBestScore = localStorage.getItem('bestScore') || null;
    this.isBestScore = !!localBestScore;
    if (this.isBestScore) {
      this.bestScore = Number.parseInt(localBestScore);
    }
  }

  checkAndSetBestScore() {
    if (!this.isBestScore) {
      this.bestScore = this.gameState.score;
    }
  }

  startGame() {
    this.pairCounter = 0;
    this.gameState = new GameState();
    this.isNewBestScore = false;
    this.getBestScore();
    this.checkAndSetBestScore();
    setTimeout(() => {
      this.isGameOver = false;
    }, 0);
  }

  revealCard(currentCard: number) {
    if (this.gameState.gameLock) {
      return;
    }
    const cardElement = this.getCardElement(currentCard);
    const currentImage = this.gameState.deck[currentCard];
    cardElement.style.backgroundImage = `url(${currentImage})`;

    if (this.gameState.visibleCardIndex < 0) {
      this.gameState.visibleCardIndex = currentCard;
      return;
    }
    if (this.gameState.visibleCardIndex === currentCard) {
      return;
    }
    this.handlePairReveal(currentCard);
  }

  handlePairReveal(currentCard: number) {
    this.gameState.lockGame();
    const currentImage = this.gameState.deck[currentCard];
    const pair = [this.getCardElement(currentCard), this.getCardElement(this.gameState.visibleCardIndex)];
    const isMatch = this.gameState.isMatch(currentImage);

    if (isMatch) {
      this.handleMatch(pair);
    } else this.handleFail(pair);

    this.gameState.resetVisibleCard();
    this.gameState.calculateMaxTurnCount(isMatch);
    this.gameState.increaseScore();
    this.checkAndSetBestScore();
    this.setBonus(isMatch);
  }

  handleMatch(cardsArray: HTMLDivElement[]) {
    setTimeout(() => {
      cardsArray.forEach((card) => {
        card.classList.add(this.hiddenClass);
        card.style.backgroundImage = `url(${this.cardBack})`;
      });
      this.pairCounter++;
      this.checkWin();
      this.gameState.unlockGame();
    }, 1000);
  }

  handleFail(cardsArray: HTMLDivElement[]) {
    setTimeout(() => {
      cardsArray.forEach((card) => card.style.backgroundImage = `url(${this.cardBack})`);
      this.checkLoose();
      this.gameState.unlockGame();
    }, 1000);
  }

  getCardElement(index: number): HTMLDivElement {
    return <HTMLDivElement >document.getElementById(`card${index}`);
  }

  setBonus(isMatch: boolean) {
    this.isBonus = isMatch;
  }

  checkWin() {
    if (this.pairCounter === this.gameState.pairsCount) {
      this.isWin = true;
      this.checkBestScore();
      this.endGame();
    }
  }

  checkLoose() {
    if (this.gameState.maxTurnCount === 0) {
      this.isWin = false;
      this.endGame();
    }
  }

  endGame() {
    // document.querySelectorAll('.card').forEach(card => {
    //   card.classList.add(this.hiddenClass);
    //  });
    document.querySelectorAll(`.${this.hiddenClass}`).forEach(card => {
      card.classList.remove(this.hiddenClass);
     });
     this.isGameOver = true;
  }

  checkBestScore() {
    const currentScore = this.gameState.score;
    if (!this.isBestScore || currentScore <= this.bestScore) {
      localStorage.setItem('bestScore', currentScore.toString());
      this.isNewBestScore = true;
    }
  }

}
