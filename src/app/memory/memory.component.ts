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

  constructor() { }

  ngOnInit() {
    this.content = require('../../assets/memory.json');
    this.cards = Array.from(this.content.cards)
    this.startGame(this.cards)
  }


  startGame(cards: string[]) {
    let revealCard = this.revealCard
    cards.forEach((card, index, Array ) => {
      document.getElementById('c' + index).addEventListener(
        'click', function () { revealCard(index, Array); }
      )
    });
  }

  revealCard(i: number, array: string[]) {
    let oneVisible = false
    let turnCounter = 0
    let visibleNr: number
    let lock = false
    let pairsLeft = 6
    let cards = array

    const card = document.getElementById('c' + i)
    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])

    if (opacityValue != 0 && lock == false) {
      lock = true
      let image = 'url(' + cards[i] + ')'
      console.log(image)

      card.style.backgroundImage = image;
      card.classList.add('cardA')
      card.classList.remove('card')


      if (oneVisible == false) {
        // first card
        visibleNr = i
        oneVisible = true
        lock = false
      } else {
        // second card
        if (cards[visibleNr] == cards[i]) {
          // pair
          setTimeout(function () {
            this.hide2Cards(i, visibleNr)
          }, 750);

          pairsLeft--;
          if (pairsLeft == 0) {
            let board = document.getElementById('board')
            board.innerHTML = '<h1>You win!<br>Done in ' + turnCounter + ' turns</h1>'
          }

          lock = false;
        } else {
          // fail
          setTimeout(function () {
            this.restore2Cards(i, visibleNr)
          }, 1000);
          lock = false;
        }
      }

      turnCounter++
      document.getElementById('score').innerHTML = 'Turn counter: ' + turnCounter
    }
  }

  hide2Cards(first: number, second: number) {
    document.getElementById('c' + first).style.opacity = '0'
    document.getElementById('c' + second).style.opacity = '0'
  }

  restore2Cards(first: number, second: number) {
    let cardsToRestore: number[] = [first, second]

    for (let i = 0; i < cardsToRestore.length; i++) {
      let card = document.getElementById('c' + i)
      card.style.backgroundImage = 'url("../../assets/img/karta.png")'
      card.classList.add('card')
      card.classList.remove('cardA')
    }
  }

}
