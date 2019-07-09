import { Component, OnInit } from '@angular/core';
import { Memory } from '../models/memory';
import { GameState } from '../models/game-state';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {

  content: Memory
  cards: string[]
  gameState: GameState

  constructor() { }

  ngOnInit() {
    this.content = require('../../assets/memory.json');
    this.cards = Array.from(this.content.cards)
    this.gameState = new GameState()
    this.startGame(this.shuffleCards(this.cards), this.gameState)
  }


  startGame(cards: string[], gameState: GameState) {
    let revealCard = this.revealCard
    cards.forEach((card, index, Array) => {
      document.getElementById('c' + index).addEventListener(
        'click', function () { revealCard(index, Array, gameState); }
      )
    });
  }

  shuffleCards(deck: string[]): string[] {
    // if it's 1 or 0 items, just return
    if (deck.length <= 1) return deck;

    // For each index in deck
    for (let i = 0; i < deck.length; i++) {

      // choose a random not-yet-placed item to place there
      // must be an item AFTER the current item, because the stuff
      // before has all already been placed
      const randomChoiceIndex = getRandom(i, deck.length - 1);

      // place our random choice in the spot by swapping
      [deck[i], deck[randomChoiceIndex]] = [deck[randomChoiceIndex], deck[i]];

      function getRandom(floor: number, ceiling: number) {
        return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
      }
    }
    return deck;
  }

  revealCard(i: number, array: string[], gameState: GameState) {
    let cards = array

    const card = document.getElementById('c' + i)
    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])

    if (opacityValue != 0 && gameState.lock == false) {
      gameState.lock = true
      let image = 'url(' + cards[i] + ')'

      card.style.backgroundImage = image;
      card.classList.add('cardA')
      card.classList.remove('card')


      if (gameState.oneVisible == false) {
        // first card
        gameState.visibleNr = i
        gameState.oneVisible = true
        gameState.lock = false
        console.log('visible' + i)
      }
      else {
        // second card
        if (cards[gameState.visibleNr] == cards[i]) {
          // pair
          setTimeout(function () {
            hide2Cards(i, gameState.visibleNr)
          }, 750);

        
        }

        else {
          // fail
          setTimeout(function () {
            restore2Cards(i, gameState.visibleNr)
          }, 1000);
          
        }
      }
      gameState.turnCounter++
      document.getElementById('score').innerHTML = 'Turn counter: ' + gameState.turnCounter

      function hide2Cards(first: number, second: number) {
        document.getElementById('c' + first).style.opacity = '0'
        document.getElementById('c' + second).style.opacity = '0'

        gameState.pairsLeft--;
        if (gameState.pairsLeft == 0) {
          let board = document.getElementById('board')
          board.innerHTML = '<h1>You win!<br>Done in ' + gameState.turnCounter + ' turns</h1>'
        }
        gameState.oneVisible = false
        gameState.lock = false;
      }

      function restore2Cards(first: number, second: number) {
        let cardsToRestore: number[] = [first, second]

        cardsToRestore.forEach((number) => {
          let card = document.getElementById('c' + number)
          card.style.backgroundImage = 'url("../../assets/img/karta.png")'
          card.classList.add('card')
          card.classList.remove('cardA')
        });

        gameState.oneVisible = false
        gameState.lock = false;
      }
    }
  }


}
