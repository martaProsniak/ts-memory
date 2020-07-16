import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  pixelsPerFrame;

  ngOnInit() {
    this.pixelsPerFrame = 8;
    this.checkIntro();
  }

  checkIntro() {
    const maxTopPosition = 150;
    const intro = document.getElementById('intro');
    const container = document.getElementById('event-handler');

    container.addEventListener('click', () => {
      this.pixelsPerFrame = 20;
    }, { once: true });

    const animateIntro = () => {
        let currentPosition = intro.offsetTop;

        if (currentPosition <= maxTopPosition) {
          return;
        }
        else {
          intro.style.top = `${currentPosition - this.pixelsPerFrame}px`;
          window.requestAnimationFrame(animateIntro);
        }
    }

    animateIntro();
  }
}
