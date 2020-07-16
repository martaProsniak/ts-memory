import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const container = document.getElementById('event-handler')
    container.addEventListener('click', function () {
      const intro = document.getElementById('intro');
      window.requestAnimationFrame(() => {
        intro.style.setProperty("transition", 'none');
      })
    }, { once: true })
    this.checkIntro();
  }

  checkIntro() {
    let isIntro = false;

    startIntro(isIntro);

    function startIntro(isIntro: boolean) {
      if(!isIntro) {
        isIntro = true;
        window.requestAnimationFrame(() => {startIntro(isIntro)});
      } else {
        const introContainer = document.getElementById('intro');
        introContainer.style.filter = 'opacity(1)';
        introContainer.style.transform = 'translateY(0)';
      }
    }
  }
}
