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
      "Suddenly... He was attacked by the aliens!", "Now he must rush through their attack line and escape...",
      "He must shoot two the same targets at once to break one line.", "Would you help him?"]
  tickDuration: number = 10
  static introFinalPosition: number = 150
  static interval;

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareIntro();
    LandingComponent.interval = setInterval(this.changeIntroPosition, this.tickDuration)
    let container = document.getElementById('event-handler')
    container.addEventListener('click', function () {
      LandingComponent.skipIntro()
    }, { once: true })
  }

  changeIntroPosition() {
    const intro = document.getElementById('intro')
    if (!intro){
      clearInterval(LandingComponent.interval)
      return;
    }
    const speed = 2000
    const tickDuration = 10
    const time = tickDuration / 1000
    let introCurrentPosition = intro.offsetTop;

    if (introCurrentPosition <= LandingComponent.introFinalPosition) {
      intro.style.top = introCurrentPosition + 'px'
      clearInterval(LandingComponent.interval)
      return
    }

    let introNewPosition = introCurrentPosition - speed * time + ((time * time) / 2)
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

    function displayText(sentence: string) {
      const textBox = document.createElement('h3')

      textBox.innerHTML = sentence
      textBox.style.textAlign = 'center'
      textBox.style.marginBottom = '10px'
      textBox.style.fontSize = '1em'

      intro.appendChild(textBox);
    }

    function displayImage(source: string) {
      const imageBox = document.createElement('div')
      imageBox.style.width = '50px'
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

    function setIntroStartPosition() {
      intro.style.position = 'absolute'
      intro.style.top = '100%'
      intro.style.left = '50%'
      intro.style.transform = 'translateX(-50%)'
      intro.style.transition = 'all 0.1s ease-in'
    }
  }

  play() {
    clearInterval(LandingComponent.interval)
    this.router.navigateByUrl('/game')
  }

  static skipIntro() {
    const intro = document.getElementById('intro')
    intro.style.transition = 'all 0.5s ease-in'
    intro.style.top = LandingComponent.introFinalPosition + 'px'
    clearInterval(LandingComponent.interval)
  }

}
