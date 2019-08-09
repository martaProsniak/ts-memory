import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  textsToDisplay: string[] =
    ["A long time ago in a galaxy far far away...", "A young, brave adventurer started his cosmic journey...",
      "Unfortunately...", "...he lost his way!", "Now he must solve the puzzle and match all cards to turn on the autopilot...",
      "...but his memory has always been a little poor...", "...and everything shakes all the time!",
      "Would you help him?"]
  tickDuration: number = 10

  constructor() { }

  ngOnInit() {
    this.prepareBoard();
    setInterval(this.changeBoardPosition , this.tickDuration)
    console.log(this.textsToDisplay);
  }

  changeBoardPosition(){
    const board = document.getElementById('board')
    const speed = 1000
    const tickDuration = 10
    const time = tickDuration / 1000
    const acceleration = 10
    console.log(time)
    let boardCurrentPosition = board.offsetTop;

    if (boardCurrentPosition <= 150){
      board.style.top = boardCurrentPosition + 'px'
      return;
    }

    let boardNewPosition = boardCurrentPosition - speed * time + ((acceleration*time*time) / 2)

    console.log(boardCurrentPosition, boardNewPosition)

    board.style.top = boardNewPosition + 'px'
  }


  prepareBoard() {
    const board = document.getElementById('board')
    setBoardStartPosition()

    for (let i = 0; i < this.textsToDisplay.length; i++) {
      const sentence = this.textsToDisplay[i]
      displayText(sentence)
    }

    function displayText(sentence: string){
        board.className = "board-start"
        const textBox = document.createElement('h3')
        textBox.innerHTML = sentence
        textBox.style.textAlign = 'center'
        
        board.appendChild(textBox);
    }

    function setBoardStartPosition(){
      board.style.position = 'absolute'
      board.style.top = '100%'
      board.style.left = '10%'
      board.style.transition = 'all 0.1s ease-in'
    }
     
  }

}
