import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryComponent } from '../memory/memory.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  textsToDisplay: string[] =
    ["A long time ago in a galaxy far far away...", "A young, brave adventurer started his cosmic journey...",
      "Unfortunately... he lost his way!", "Now he must crack the password by matching all pairs to turn on the autopilot...",
      "...everything's shaking and the aliens are following him!", "Would you help him?"]
  tickDuration: number = 10
  static boardFinalPosition: number = 150
  static interval;

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareIntro();
    LandingComponent.interval = setInterval(this.changeIntroPosition , this.tickDuration)
    let container = document.getElementById('event-handler')
      container.addEventListener('click', function(){
        LandingComponent.skipIntro()
      }, {once: true})
  }

  changeIntroPosition(){
    const intro = document.getElementById('intro')
    const speed = 2000
    const tickDuration = 10
    const time = tickDuration / 1000
    let introCurrentPosition = intro.offsetTop;

    if (introCurrentPosition <= LandingComponent.boardFinalPosition){
      intro.style.top = introCurrentPosition + 'px'
      clearInterval(LandingComponent.interval)
      return
    }

    let introNewPosition = introCurrentPosition - speed * time + ((time*time) / 2)
    intro.style.top = introNewPosition + 'px'
    
  }
  

  prepareIntro() {
    const intro = document.getElementById('intro')
    let astronautSrc = '../../assets/img/astronaut.png'
    let alienSrc = '../../assets/img/alien.png'
    setIntroStartPosition()
    displayImage(astronautSrc)

    for (let i = 0; i < this.textsToDisplay.length; i++) {
      const sentence = this.textsToDisplay[i]
      displayText(sentence)
    }
    displayImage(alienSrc)

    function displayText(sentence: string){
        const textBox = document.createElement('h3')
        const screenSm = 375
        const screenMd = 768
        let screenWidth = window.screen.width;

        textBox.innerHTML = sentence
        textBox.style.textAlign = 'center'
        textBox.style.marginBottom = '10px'
        if (screenWidth <= screenSm ){
          textBox.style.fontSize = '14px'
        } else if (screenWidth <= screenMd){
          textBox.style.fontSize = '16px'
        } else {
          textBox.style.fontSize = '22px'
        }
        
        intro.appendChild(textBox);
    }

    function displayImage(source: string){
      const imageBox = document.createElement('div')
      const screenMd = 768
      if(window.screen.width > screenMd){
        imageBox.style.width = '75px'
      } else {
        imageBox.style.width = '50px'
      }
      imageBox.style.height = 'auto'
      imageBox.style.marginRight = 'auto'
      imageBox.style.marginLeft = 'auto'
      imageBox.style.marginTop = '1%'
      imageBox.style.padding = '0'

      const heroImg = document.createElement('img')
      heroImg.setAttribute('src', source)
      heroImg.style.width = '100%'
      heroImg.style.height = '100%'
      
      imageBox.appendChild(heroImg)
      intro.appendChild(imageBox)
    }

    function setIntroStartPosition(){
       intro.style.position = 'absolute'
       intro.style.top = '100%'
      intro.style.left = '50%'
      intro.style.transform = 'translateX(-50%)'
      intro.style.transition = 'all 0.1s ease-in'
    }
  }

  play(){
    clearInterval(LandingComponent.interval)
    this.router.navigateByUrl('/game')
  }

  static skipIntro(){
    const intro = document.getElementById('intro')
    intro.style.transition = 'all 0.5s ease-in'
    intro.style.top = LandingComponent.boardFinalPosition + 'px'
    clearInterval(LandingComponent.interval)
  }

}
