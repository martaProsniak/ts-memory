import { Component, OnInit } from '@angular/core';
import { Memory } from '../models/memory';
import { GameState } from '../models/game-state';
import { Card } from './card';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {

  content: Memory
  static cards: Card[];
  static song: any
  static isMusicOn: boolean;
  static gameState: GameState
  static bestScore: number = 0;

  constructor() {
    this.content = require('../../assets/memory.json');
    MemoryComponent.song = new Audio()
    MemoryComponent.song.src = '../../assets/song.wav'
    MemoryComponent.isMusicOn = true;
  }

  ngOnInit() {
    MemoryComponent.cards = this.loadCards();
    this.start()
  }

  loadCards(): Card[] {
    let cardsFromContent = Array.from(this.content.cards);
    let cards = new Array;
    const revers = '../../assets/img/alien.png'

    cardsFromContent.forEach(card => {
      let cardToLoad = new Card()
      cardToLoad.face = card
      cardToLoad.revers = revers
      cards.push(cardToLoad);
    });
    return cards;
  }

  start() {
    this.drawBoard()
    MemoryComponent.gameState = new GameState()
    this.startNewGame(this.shuffleCards(MemoryComponent.cards))
  }


  drawBoard() {
    let board = document.getElementById('board')
    // clear board before starting a new game
    board.innerHTML = ''
    this.drawCards(board);
    this.drawScoreBox(board)
  }

  drawScoreBox(container: any) {
    let scoreBox = document.createElement('div')
    scoreBox.classList.add('score')
    scoreBox.setAttribute('id', 'score')
    scoreBox.style.marginLeft = 'auto'
    scoreBox.style.marginRight = 'auto'
    scoreBox.style.marginTop = '30px'
    scoreBox.innerHTML = 'Turns till end: ?'
    scoreBox.style.fontSize = '24px;'
    scoreBox.style.letterSpacing = '0.1em'

    container.appendChild(scoreBox)
  }

  drawCards(container: any) {
    const revers = MemoryComponent.cards[0].revers;

    for (let i = 0; i < MemoryComponent.cards.length; i++) {
      let cardBox = document.createElement('div')
      cardBox.setAttribute('id', 'c' + i)
      cardBox.appendChild(setCardImage(i))
      this.styleCards(cardBox)
      container.appendChild(cardBox)
    }

      function setCardImage(i: number){
        let initialImage = revers 
        const cardImage = document.createElement('img')
        cardImage.setAttribute('src', initialImage);
        cardImage.setAttribute('id', 'img' + i)
        cardImage.style.width = '95%'
        cardImage.style.height = '95%'
        cardImage.style.objectFit = 'cover'
        cardImage.style.border = '1px black solid'
        cardImage.style.borderRadius = '50%'
        cardImage.className = 'cardImage'

        cardImage.addEventListener('mouseover', function(){
          cardImage.style.boxShadow = '0px 0px 20px 0px #2faac0'
        })
    
        cardImage.addEventListener('mouseout', function(){
          cardImage.style.boxShadow = 'none'
        })

        return cardImage;
      }
  }

  startNewGame(cards: Card[]) {
    cards.forEach((card, index, Array) => {
      document.getElementById('c' + index).addEventListener(
        'click', function () { MemoryComponent.revealCard(index, Array); }
      )
    });
  }

  resetMusic() {
    MemoryComponent.song.pause()
    MemoryComponent.song.currentTime = 0
  }

  controlMusic(){
    let target = event.target as HTMLButtonElement
    if (MemoryComponent.isMusicOn){
      MemoryComponent.song.pause()
      MemoryComponent.song.currentTime = 0
      MemoryComponent.isMusicOn = false;
      target.innerHTML = 'MUSIC: OFF'
    } else {
      MemoryComponent.isMusicOn = true;
      target.innerHTML = 'MUSIC: ON'
    }
    
  }

  shuffleCards(deck: Card[]): Card[] {
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

  static revealCard(i: number, array: Card[]) {
    let cards = array

    // check card opacity
    const card = document.getElementById('c' + i)
    const cardImage = document.getElementById('img' + i)

    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])

    if (opacityValue != 0 && MemoryComponent.gameState.lock == false) {
      MemoryComponent.gameState.lock = true
      let image = cards[i].face

      cardImage.setAttribute('src', image)

      // check if one card is visible
      if (MemoryComponent.gameState.oneVisible == false) {
        MemoryComponent.gameState.visibleNr = i
        MemoryComponent.gameState.oneVisible = true
        MemoryComponent.gameState.lock = false;
      }
      // check if the most recently revealed card is the same as the visible one
      if (MemoryComponent.gameState.visibleNr == i) {
        MemoryComponent.gameState.oneVisible = true;
        MemoryComponent.gameState.lock = false;
        return;
      }

      if (cards[MemoryComponent.gameState.visibleNr].face == cards[i].face) {
        setTimeout(function () {
          MemoryComponent.hide2Cards(i, MemoryComponent.gameState.visibleNr)
        }, 750);
      }
      else {
        // fail
        setTimeout(function () {
          MemoryComponent.restore2Cards(i, MemoryComponent.gameState.visibleNr)
        }, 1000);
      }

      MemoryComponent.gameState.turnCounter++

      if(MemoryComponent.gameState.turnCounter === MemoryComponent.gameState.maxTurnCount){
        MemoryComponent.endGame();
      }
      document.getElementById('score').innerHTML = 'Turns till end: ' + (MemoryComponent.gameState.maxTurnCount - MemoryComponent.gameState.turnCounter)
    }
  }

  static hide2Cards(first: number, second: number) {
    document.getElementById('c' + first).style.opacity = '0'
    document.getElementById('c' + second).style.opacity = '0'

    MemoryComponent.gameState.pairsLeft--;
    if (MemoryComponent.gameState.pairsLeft == 0) {
      MemoryComponent.endGame()
    }
    MemoryComponent.gameState.oneVisible = false
    MemoryComponent.gameState.lock = false

  }

  static restore2Cards(first: number, second: number){
    let cardsToRestore: number[] = [first, second]

    cardsToRestore.forEach((number) => {
      let cardImage = document.getElementById('img' + number)
      cardImage.setAttribute('src', MemoryComponent.cards[number].revers)
    });

    MemoryComponent.gameState.oneVisible = false
    MemoryComponent.gameState.lock = false;
  }


  static endGame() {
    if (this.bestScore === 0 || this.bestScore > this.gameState.turnCounter) {
      this.bestScore = this.gameState.turnCounter
    }
    MemoryComponent.drawWinAlert();
    MemoryComponent.song.play();
  }

  static drawWinAlert() {
    let board = document.getElementById('board')
    let boardStyle = getComputedStyle(board);
    let boardHeight = boardStyle['height']
    board.innerHTML = ''
    let winAlert = document.createElement('div')
    winAlert.style.width = '80%'
    winAlert.style.height = boardHeight
    winAlert.style.position = 'relative'
    winAlert.style.marginLeft = 'auto'
    winAlert.style.marginRight = 'auto'

    let winAlertWrapper = document.createElement('div')
    winAlertWrapper.style.position = 'absolute';
    winAlertWrapper.style.top = '50%'
    winAlertWrapper.style.left = '50%'
    winAlertWrapper.style.transform = 'translate(-50%, -50%)'
    winAlertWrapper.style.width = '100%'
    winAlertWrapper.style.backgroundColor= 'transparent'
    winAlertWrapper.style.boxShadow = '1px 2px 1px 0px #021533'
    winAlertWrapper.style.webkitBoxShadow = '1px 2px 1px 0px #021533'
    winAlertWrapper.style.textAlign = 'center'

    let winAlertText = document.createElement('h3')
    winAlertText.innerHTML = 'You win!<br>Done in ' + MemoryComponent.gameState.turnCounter + ' turns<br>Best score so far: ' + this.bestScore
    winAlertText.style.width = '100%'
    winAlertText.style.height = '100%'
    winAlertText.style.fontSize = '1.5em'
    winAlertText.style.color = 'white'
    winAlertText.classList.add('shake-little')
    winAlertText.classList.add('shake-constant')
    winAlertText.classList.add('shake-constant-hover')
    board.appendChild(winAlert)
    winAlert.appendChild(winAlertWrapper)
    winAlertWrapper.appendChild(winAlertText)
  }

  styleCards(cardBox: any) {
    cardBox.style.textAlign = 'center'
    cardBox.style.cursor = 'pointer'
    cardBox.style.filter = 'brightness(80%)'
    cardBox.style.transition = 'all .3s ease-in'
    cardBox.style.marginTop = '20px'
    cardBox.classList.add('cardBox', 'shake-little', 'shake-constant', 'shake-constant--hover', 
    'col-xs-4', 'col-sm-3')
    cardBox.style.background = 'transparent'
  }
}
