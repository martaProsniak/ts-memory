import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  static interval;

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareBoard();
    LandingComponent.interval = setInterval(this.changeBoardPosition , this.tickDuration)
  }

  changeBoardPosition(){
    const board = document.getElementById('board')
    const speed = 2000
    const tickDuration = 10
    const time = tickDuration / 1000
    let boardCurrentPosition = board.offsetTop;

    if (boardCurrentPosition <= 120){
      board.style.top = boardCurrentPosition + 'px'
      clearInterval(LandingComponent.interval)
      return
    }

    let boardNewPosition = boardCurrentPosition - speed * time + ((time*time) / 2)
    board.style.top = boardNewPosition + 'px'
    
  }
  

  prepareBoard() {
    let play = this.play.bind(this);
    console.log(play)
    const board = document.getElementById('board')
    setBoardStartPosition()

    for (let i = 0; i < this.textsToDisplay.length; i++) {
      const sentence = this.textsToDisplay[i]
      displayText(sentence)
    }

    showButton()

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

    function showButton(){
      const playBtn = document.createElement('button')
      playBtn.innerHTML = "PLAY"
      
      playBtn.style.width = '30%'
      playBtn.style.background = 'transparent'
      playBtn.style.marginTop = '25px'
      playBtn.style.color = 'white'
      playBtn.style.fontSize = '1.5rem'
      playBtn.style.border = 'none'
      playBtn.style.fontFamily = '"Orbitron", sans-serif'

      playBtn.addEventListener('onmouseover', function(event){
        playBtn.style.cursor = 'pointer'
      })

      board.appendChild(playBtn)
    }
  }

  play(){
    this.router.navigate(['/game'])
  }

}
