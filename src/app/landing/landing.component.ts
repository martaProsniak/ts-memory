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
      "Unfortunately... he lost his way!", "Now he must crack the password by matching all pairs to turn on the autopilot...",
      "...everything's shaking and the aliens are following him!", "Would you help him?"]
  tickDuration: number = 10
  static interval;

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareIntro();
    LandingComponent.interval = setInterval(this.changeIntroPosition , this.tickDuration)
  }

  changeIntroPosition(){
    const intro = document.getElementById('intro')
    const speed = 2000
    const tickDuration = 10
    const time = tickDuration / 1000
    let introFinalPosition = 75
    let introCurrentPosition = intro.offsetTop;

    if (introCurrentPosition <= introFinalPosition){
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
        intro.className = "intro-start"
        const textBox = document.createElement('h3')
        textBox.innerHTML = sentence
        textBox.style.textAlign = 'center'
        textBox.style.marginBottom = '5%'
        
        intro.appendChild(textBox);
    }

    function displayImage(source: string){
      const heroBox = document.createElement('div')
      heroBox.style.width = '75px'
      heroBox.style.height = 'auto'
      heroBox.style.marginRight = 'auto'
      heroBox.style.marginLeft = 'auto'
      heroBox.style.padding = '0'

      const heroImg = document.createElement('img')
      heroImg.setAttribute('src', source)
      heroImg.style.width = '100%'
      heroImg.style.height = '100%'
      
      heroBox.appendChild(heroImg)
      intro.appendChild(heroBox)
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
    this.router.navigate(['/game'])
  }

}
