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

  constructor() {
    this.cards = this.shuffleCards(new Cards().cards);
  }

  ngOnInit(): void {
    this.startGame();
  }

  shuffleCards(deck: string[]): string[] {
    function getRandom(floor: number, ceiling: number) {
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

  startGame() {
    this.gameState = new GameState();

  }

  revealCard(index: number) {
    const card = document.getElementById(`card${index}`);
    card.style.backgroundImage = `url(${this.cards[index]})`;
  }

}
