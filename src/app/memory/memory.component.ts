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

  constructor() { 
    this.content = require('../../assets/memory.json');
    this.cards = Array.from(this.content.cards)
  }

  ngOnInit() {
    this.draw()
    this.gameState = new GameState()
    console.log (this.gameState)
    this.startNewGame(this.shuffleCards(this.cards), this.gameState)
  }

  start(){
    this.ngOnInit()
  }

  draw(){
    let board = document.getElementById('board')
    // clear board before starting a new game
    board.innerHTML = ''

    for (let i = 0; i<this.cards.length; i++){
      let cardBox = document.createElement('div')
      cardBox.classList.add('card')
      cardBox.setAttribute('id', 'c'+i)

      cardBox.style.width = '125px'
      cardBox.style.height = '125px'
      cardBox.style.display = 'inline-block'
      cardBox.style.margin = '7.5px'
      cardBox.style.backgroundImage = 'url("../../assets/img/card.png")'
      cardBox.style.border = '4px solid #152e55'
      cardBox.style.borderRadius = '4px'
      cardBox.style.cursor = 'pointer'
      cardBox.style.filter = 'brightness(80%)'
      cardBox.style.transition = 'all .3s ease-in-out'
      cardBox.style.boxShadow = '1px 1px 1px 0px #021533';

      cardBox.onmouseover = function(){
        cardBox.style.border = '4px solid #035599'
        cardBox.style.filter = 'brightness(100%)'
      }

      cardBox.onmouseleave = function(){
        cardBox.style.border = '4px solid #152e55'
        cardBox.style.filter = 'brightness(80%)'
      }

      board.appendChild(cardBox)
    }
    let scoreBox = document.createElement('div')
    scoreBox.classList.add('score')
    scoreBox.setAttribute('id', 'score')
    scoreBox.innerHTML = 'Turn counter: 0'
    board.appendChild(scoreBox)
  }

  startNewGame(cards: string[], gameState: GameState) {
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

      // https://basarat.gitbooks.io/algorithms/content/docs/shuffling.html
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

    if (opacityValue != 0 && !gameState.lock) {
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
        gameState.turnCounter++
        document.getElementById('score').innerHTML = 'Turn counter: ' + gameState.turnCounter
      }

    }
    
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
        card.style.backgroundImage = 'url("../../assets/img/card.png")'
        card.classList.add('card')
        card.classList.remove('cardA')
      });

      gameState.oneVisible = false
      gameState.lock = false;
    }
  }

}
