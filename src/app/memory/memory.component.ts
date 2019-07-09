import { Component, OnInit } from '@angular/core';
import { Memory } from '../models/memory';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {

  content: Memory
  cards: string[]
  oneVisible: boolean
  turnCounter: number
  visibleNr: number
  lock: boolean
  pairsLeft: number

  constructor() { }

  ngOnInit() {
    this.content = require ('../../assets/memory.json');
    this.cards = this.content.cards
    console.log(this.content)

  }

  setGameState() {
    this.oneVisible = false
    this.turnCounter = 0
    this.lock = false
    this.pairsLeft = 6
  }

  startGame(){
    let revealCard = this.revealCard
    this.cards.forEach((card, index) => {
      document.getElementById('c'+index).addEventListener(
        'click', function() {revealCard(index);}
      )
    });
  }

  shuffleCards(){

  }

  revealCard(i) {
    const card = document.getElementById('c' + i)
    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])

    if (opacityValue != 0 && this.lock == false) {
      this.lock = true
      let image = 'url(' + this.cards[i] + ')'
      console.log(image)

      card.style.backgroundImage = image;
      card.classList.add('cardA')
      card.classList.remove('card')


      if (this.oneVisible == false) {
        // first card
        this.visibleNr = i
        this.oneVisible = true
        this.lock = false
      } else {
        // second card
        if (this.cards[this.visibleNr] == this.cards[i]) {
          // pair
          setTimeout(function () {
            this.hide2Cards(i, this.visibleNr)
          }, 750)
        } else {
          // fail
          setTimeout(function () {
            this.restore2Cards(i, this.visibleNr)
          }, 1000)
        }
      }

      this.turnCounter++
      document.getElementById('score').innerHTML = 'Turn counter: ' + this.turnCounter
    }
  }

  hide2Cards(first: number, second: number) {
    document.getElementById('c' + first).style.opacity = '0'
    document.getElementById('c' + second).style.opacity = '0'

    this.pairsLeft--;

    if (this.pairsLeft == 0) {
      let board = document.getElementById('board')
      board.innerHTML = '<h1>You win!<br>Done in ' + this.turnCounter + ' turns</h1>'
    }
    this.lock = false;
  }

  restore2Cards(first: number, second: number) {
    let cardsToRestore: number[] = [first, second]

    for (let i = 0; i < cardsToRestore.length; i++) {
      let card = document.getElementById('c' + i)
      card.style.backgroundImage = 'url("../../assets/img/karta.png")'
      card.classList.add('card')
      card.classList.remove('cardA')
    }

    this.lock = false;
  }

}
