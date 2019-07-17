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
  public static gameState: GameState
  static bestScore: number = 0;

  constructor() {
    this.content = require('../../assets/memory.json');
    this.cards = Array.from(this.content.cards)
  }

  ngOnInit() {
    this.drawBoard()
    MemoryComponent.gameState = new GameState()
    this.startNewGame(this.shuffleCards(this.cards))
  }

  start() {
    this.ngOnInit()
  }

  drawBoard() {
    let board = document.getElementById('board')
    // clear board before starting a new game
    board.innerHTML = ''

    for (let i = 0; i < this.cards.length; i++) {
      let cardBox = document.createElement('div')
      cardBox.classList.add('card')
      cardBox.setAttribute('id', 'c' + i)

      this.styleCards(cardBox)

      board.appendChild(cardBox)
    }

    let scoreBox = document.createElement('div')
    scoreBox.classList.add('score')
    scoreBox.setAttribute('id', 'score')
    scoreBox.innerHTML = 'Turn counter: 0'
    board.appendChild(scoreBox)
  }

  startNewGame(cards: string[]) {
    let revealCard = this.revealCard
    cards.forEach((card, index, Array) => {
      document.getElementById('c' + index).addEventListener(
        'click', function () { revealCard(index, Array); }
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

  revealCard(i: number, array: string[]) {
    let cards = array

    const card = document.getElementById('c' + i)
    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])

    if (opacityValue != 0 && !(MemoryComponent.gameState.lock)) {
      MemoryComponent.gameState.lock = true
      let image = 'url(' + cards[i] + ')'

      card.style.backgroundImage = image;
     

      if (MemoryComponent.gameState.oneVisible == false) {
        // first card
        MemoryComponent.gameState.visibleNr = i
        MemoryComponent.gameState.oneVisible = true
        MemoryComponent.gameState.lock = false;
      }
      else {
        // check if not the same as the visible one
        if (MemoryComponent.gameState.visibleNr == i) {
          MemoryComponent.gameState.oneVisible = true;
          MemoryComponent.gameState.lock = false;
          return;
        }
        if (cards[MemoryComponent.gameState.visibleNr] == cards[i]) {
          // pair
          setTimeout(function () {
            hide2Cards(i, MemoryComponent.gameState.visibleNr)
          }, 750);
        }
        else {
          // fail
          setTimeout(function () {
            restore2Cards(i, MemoryComponent.gameState.visibleNr)
          }, 1000);
        }
        MemoryComponent.gameState.turnCounter++
        document.getElementById('score').innerHTML = 'Turn counter: ' + MemoryComponent.gameState.turnCounter
      }

    }

    function hide2Cards(first: number, second: number) {
      document.getElementById('c' + first).style.opacity = '0'
      document.getElementById('c' + second).style.opacity = '0'

      MemoryComponent.gameState.pairsLeft--;
      if (MemoryComponent.gameState.pairsLeft == 0) {
        MemoryComponent.endGame()
      }
      MemoryComponent.gameState.oneVisible = false
      MemoryComponent.gameState.lock = false
    }

    function restore2Cards(first: number, second: number) {
      let cardsToRestore: number[] = [first, second]

      cardsToRestore.forEach((number) => {
        let card = document.getElementById('c' + number)
        card.style.backgroundImage = 'url("../../assets/img/card.png")'
        card.classList.add('card')
        card.classList.remove('cardA')
      });

      MemoryComponent.gameState.oneVisible = false
      MemoryComponent.gameState.lock = false;
    }

  }

  static endGame() {
    if (this.bestScore === 0 || this.bestScore > this.gameState.turnCounter) {
      this.bestScore = this.gameState.turnCounter
      console.log(this.bestScore)
    }
    MemoryComponent.drawWinAlert();
  }
  
  static drawWinAlert(){
    let board = document.getElementById('board')
    board.innerHTML = ''
    let winAlert = document.createElement('div')
    winAlert.style.width = '80%'
    winAlert.style.height = '500px'
    winAlert.style.position = 'relative'
    winAlert.style.marginLeft = 'auto'
    winAlert.style.marginRight = 'auto'
  
    let winAlertWrapper = document.createElement('div')
    winAlertWrapper.style.position = 'absolute';
    winAlertWrapper.style.top = '50%'
    winAlertWrapper.style.left = '50%'
    winAlertWrapper.style.transform = 'translate(-50%, -50%)'
    winAlertWrapper.style.width = '100%'
    winAlertWrapper.style.backgroundImage = 'radial-gradient(circle, #100c21, #13162d, #161d3a, #172547, #152e55, #152e57, #152e5a, #162e5c, #1b2552, #1f1b48, #20113e, #210633)'
    winAlertWrapper.style.boxShadow = '1px 2px 1px 0px #021533'
    winAlertWrapper.style.webkitBoxShadow = '1px 2px 1px 0px #021533'
    
    let winAlertText = document.createElement('h3')
    winAlertText.innerHTML = 'You win!<br>Done in ' + MemoryComponent.gameState.turnCounter + ' turns<br>Best score so far: ' + this.bestScore
    winAlertText.style.width = '100%'
    winAlertText.style.fontSize = '26px'
    winAlertText.style.color = '#d6ecf1'
    board.appendChild(winAlert)
    winAlert.appendChild(winAlertWrapper)
    winAlertWrapper.appendChild(winAlertText)
  }

  styleCards(cardBox: any){
    cardBox.style.width = '125px'
    cardBox.style.height = '125px'
    cardBox.style.display = 'inline-block'
    cardBox.style.margin = '7.5px'
    cardBox.style.backgroundImage = 'url("../../assets/img/card.png")'
    cardBox.style.border = '4px solid #152e55'
    cardBox.style.borderRadius = '4px'
    cardBox.style.cursor = 'pointer'
    cardBox.style.filter = 'brightness(90%)'
    cardBox.style.transition = 'all .3s ease-in-out'
    cardBox.style.boxShadow = '1px 1px 1px 0px #021533';
  }
}
