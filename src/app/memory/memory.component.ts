import { Component, OnInit } from '@angular/core';
import { Memory } from '../models/memory';
import { GameState } from '../models/game-state';
import { Card } from './card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})
export class MemoryComponent implements OnInit {

  content: Memory
  static cards: Card[];
  static currentDeck: Card[];
  static song: any
  static isMusicOn: boolean = true;
  static maxTurnCount: number
  static gameState: GameState
  static bestScore: number = 0;

  constructor(private router: Router) {
    this.content = require('../../assets/memory.json');
  }

  ngOnInit() {
    MemoryComponent.cards = this.loadCards();
    MemoryComponent.song = new Audio()
    MemoryComponent.song.src = '../../assets/song.wav'
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
    this.setMaxTurnCount()
    this.drawBoard()
    this.resetMusic()
    MemoryComponent.currentDeck = this.shuffleCards(MemoryComponent.cards)
    MemoryComponent.gameState = new GameState()
    this.startNewGame(MemoryComponent.currentDeck)
  }

  setMaxTurnCount(){
    MemoryComponent.maxTurnCount = 10;
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
    scoreBox.setAttribute('id', 'score')
    scoreBox.style.marginLeft = 'auto'
    scoreBox.style.marginRight = 'auto'
    scoreBox.style.marginTop = '30px'
    scoreBox.innerHTML = 'Turns till end: '+ + MemoryComponent.maxTurnCount
    scoreBox.style.fontSize = '24px;'
    scoreBox.style.letterSpacing = '0.1em'
    scoreBox.style.color = '#93efff'

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

    function setCardImage(i: number) {
      let initialImage = revers
      const cardImage = document.createElement('img')
      cardImage.setAttribute('src', initialImage);
      cardImage.setAttribute('id', 'img' + i)
      cardImage.style.width = '95%'
      cardImage.style.height = '95%'
      cardImage.style.objectFit = 'cover'
      cardImage.style.border = '1px black solid'
      cardImage.style.borderRadius = '50%'
      cardImage.style.transition = 'all 0.2s ease-in-out'
      cardImage.className = 'cardImage'

      cardImage.addEventListener('mouseover', function () {
        cardImage.style.boxShadow = '0px 0px 20px 0px #2faac0'
      })

      cardImage.addEventListener('mouseout', function () {
        cardImage.style.boxShadow = 'none'
      })

      return cardImage;
    }
  }

  startNewGame(cards: Card[]) {
    this.resetMusic()
    this.setMaxTurnCount()
    cards.forEach((card, index) => {
      document.getElementById('img' + index).addEventListener(
        'click', function () { MemoryComponent.revealCard(index); }
      )
    });
  }

  resetMusic() {
    MemoryComponent.song.pause()
    MemoryComponent.song.currentTime = 0
  }

  controlMusic() {
    let target = event.target as HTMLButtonElement
    if (MemoryComponent.isMusicOn) {
      this.resetMusic();
      MemoryComponent.isMusicOn = false;
      target.innerHTML = 'Music: off'
    } else {
      MemoryComponent.isMusicOn = true;
      target.innerHTML = 'Music: on'
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

  static isCardInPlay(index:number): boolean{
    const card = document.getElementById('c' + index)
    let cardStyle = getComputedStyle(card);
    let opacityValue = parseInt(cardStyle['opacity'])
    return opacityValue > 0;
  }

  static revealCard(index: number) {
    const cardImage = document.getElementById('img' + index)
    if (MemoryComponent.isCardInPlay(index) && MemoryComponent.gameState.lock == false) {
      //change card image to face
      let image = MemoryComponent.currentDeck[index].face
      cardImage.setAttribute('src', image)
    }
    MemoryComponent.reactOnRevealedCard(index, MemoryComponent.currentDeck)
  }

  static reactOnRevealedCard(index: number, cards: Card[]) {
    //lock the game in case one card is already visible
    MemoryComponent.gameState.lock = true
    if (!MemoryComponent.isCardInPlay(index)){
      MemoryComponent.unlockGame();
      return;
    }
    
    let isAnyCardRevealed = MemoryComponent.gameState.oneVisible === false
    if (isAnyCardRevealed) {
      MemoryComponent.gameState.visibleNr = index
      MemoryComponent.gameState.oneVisible = true
      MemoryComponent.unlockGame();
    }

    // check if the most recently revealed card is the same as the visible one
    let isRevealedCardClickedAgain = MemoryComponent.gameState.visibleNr === index
    if (isRevealedCardClickedAgain) {
      MemoryComponent.gameState.oneVisible = true;
      MemoryComponent.unlockGame();
      return;
    }

    let isPair = cards[MemoryComponent.gameState.visibleNr].face === cards[index].face
    if (isPair) {
      setTimeout(function () {
        MemoryComponent.hide2Cards(index, MemoryComponent.gameState.visibleNr);
      }, 750);
    }
    else {
      // fail
      setTimeout(function () {
        MemoryComponent.restore2Cards(index, MemoryComponent.gameState.visibleNr)
      }, 750);
    }

    MemoryComponent.gameState.turnCounter++
    
    document.getElementById('score').innerHTML = 'Turns till end: ' + (MemoryComponent.maxTurnCount - MemoryComponent.gameState.turnCounter)

    let isTurnCounterEqualThanMaxTurnCount = MemoryComponent.gameState.turnCounter === MemoryComponent.maxTurnCount
    let isGameOver = isTurnCounterEqualThanMaxTurnCount && !isPair && MemoryComponent.gameState.pairsLeft > 0
    if (isGameOver) {
      setTimeout(function(){
        MemoryComponent.endGame();
      }, 500)
    }
  }
  static unlockGame() {
    MemoryComponent.gameState.lock = false;
  }

  static hide2Cards(first: number, second: number) {
    // bonus turn for revealing card
    MemoryComponent.maxTurnCount++;
    document.getElementById('score').innerHTML = 'Bonus turn! Turns till end: ' + (MemoryComponent.maxTurnCount - MemoryComponent.gameState.turnCounter)
    document.getElementById('c' + first).style.opacity = '0'
    document.getElementById('c' + second).style.opacity = '0'

    MemoryComponent.gameState.pairsLeft--;
    if (MemoryComponent.gameState.pairsLeft === 0) {
      MemoryComponent.endGame()
    }
    MemoryComponent.gameState.oneVisible = false
    MemoryComponent.unlockGame();
  }

  static restore2Cards(first: number, second: number) {
    let cardsToRestore: number[] = [first, second]

    cardsToRestore.forEach((number) => {
      let cardImage = document.getElementById('img' + number)
      cardImage.setAttribute('src', MemoryComponent.cards[number].revers)
    });

    MemoryComponent.gameState.oneVisible = false
    MemoryComponent.unlockGame()
  }

  static endGame() {
    let gameResult = this.gameState.turnCounter < MemoryComponent.maxTurnCount
    if (this.bestScore === 0 || this.bestScore > this.gameState.turnCounter) {
      this.bestScore = this.gameState.turnCounter

    }
    this.displayAlert(gameResult, this.bestScore);
    MemoryComponent.playSong(gameResult)
  }

  static playSong(gameResult: boolean) {
    if (MemoryComponent.isMusicOn && gameResult) {
      MemoryComponent.song.play();
    }
  }

  static displayAlert(result: boolean, bestScore: number) {
    let board = document.getElementById('board')
    let boardStyle = getComputedStyle(board);
    let boardHeight = boardStyle['height']
    let alertBox = document.createElement('div')
    let alertBoxWrapper = document.createElement('div')
    let alertBoxText = document.createElement('h4')
    //clear board
    board.innerHTML = ''
    //set new message
    alertBoxText.innerHTML = MemoryComponent.chooseMessageAfterGame(result, bestScore)

    alertBox.style.width = '75%'
    alertBox.style.height = boardHeight
    alertBox.style.position = 'relative'
    alertBox.style.marginLeft = 'auto'
    alertBox.style.marginRight = 'auto'

    alertBoxWrapper.style.position = 'absolute';
    alertBoxWrapper.style.top = '50%'
    alertBoxWrapper.style.left = '50%'
    alertBoxWrapper.style.transform = 'translate(-50%, -50%)'
    alertBoxWrapper.style.width = '100%'
    alertBoxWrapper.style.backgroundColor = 'transparent'
    alertBoxWrapper.style.textAlign = 'center'

    alertBoxText.style.marginBottom = '2%'
    alertBoxText.style.width = '100%'
    alertBoxText.style.height = '100%'
    const screenMd = 768
    if (window.screen.width >= screenMd) {
      alertBox.style.fontSize = '22px'
    } else {
      alertBox.style.fontSize = '14px'
    }
    alertBoxText.style.color = 'white'
    board.appendChild(alertBox)
    alertBox.appendChild(alertBoxWrapper)
    alertBoxWrapper.appendChild(MemoryComponent.displayImage(MemoryComponent.chooseImageAfterGame(result)))
    alertBoxWrapper.appendChild(alertBoxText)
  }


  static chooseMessageAfterGame(result: boolean, bestScore: number): string {
    let message: string;
    if (result) {
      message = '<p>Congratulations!</p><p>You\'ve successfully turned on the autopilot in ' + MemoryComponent.gameState.turnCounter + ' turns!</p><p>The astronaut is back home</p><p>Your best score so far is: ' + bestScore + '</p>'
    } else {
      message = '<p>Oh no! You\'ve crashed escaping the aliens!</p><p>I\'s miracle you\'ve survived</p><p>Fortunately you\'ve landed in the lake on some awesome planet</p><p>Some short green gnome helped you repair the ship and you\'re ready to try again.'
    }
    return message;
  }

  static chooseImageAfterGame(result: boolean): string {
    let imgSource: string;
    if (result) {
      imgSource = '../../assets/img/flag.png'
    } else {
      imgSource = '../../assets/img/alien.png'
    }
    return imgSource;
  }

  static displayImage(source: string) {
    const heroImg = document.createElement('img')
    const imageBox = document.createElement('div')
    const screenMd = 768
    if (window.screen.width > screenMd) {
      imageBox.style.width = '75px'
    } else {
      imageBox.style.width = '50px'
    }
    imageBox.style.height = 'auto'
    imageBox.style.marginRight = 'auto'
    imageBox.style.marginLeft = 'auto'
    imageBox.style.padding = '0'

    heroImg.setAttribute('src', source)
    heroImg.style.width = '100%'
    heroImg.style.height = '100%'

    imageBox.appendChild(heroImg)
    return imageBox;
  }

  styleCards(cardBox: any) {
    cardBox.style.textAlign = 'center'
    cardBox.style.cursor = 'pointer'
    cardBox.style.filter = 'brightness(80%)'
    cardBox.style.transition = 'all .1s ease-in'
    cardBox.style.marginTop = '20px'
    cardBox.classList.add('cardBox','col-xs-4', 'col-sm-3')
    cardBox.style.background = 'transparent'
  }
}
