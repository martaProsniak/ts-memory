import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements OnInit {
  intro;
  maxHeight = 140;
  startingPosition;
  pixelsPerFrame = 2;
  globalId = null;

  ngOnInit() {
    this.setStartData();
    let container = document.getElementById("event-handler");
    container.addEventListener(
      "click",
      () => {
        this.pixelsPerFrame = 20;
      },
      { once: true }
    );
    this.globalId = window.requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy() {
    this.cancelAnimation();
  }

  cancelAnimation() {
    if (!!this.globalId) {
      cancelAnimationFrame(this.globalId);
    }
  }

  setStartData() {
    this.intro = document.getElementById("intro");
    this.startingPosition = this.intro.offsetTop;
    this.intro.style.top = `${this.startingPosition}px`;
  }

  animate = () => {
    if (!this.startingPosition) {
      this.globalId = window.requestAnimationFrame(() => this.animate());
    } else if (this.startingPosition >= this.maxHeight) {
      this.startingPosition = this.startingPosition - this.pixelsPerFrame;
      this.intro.style.top = `${this.startingPosition}px`;
      this.globalId = window.requestAnimationFrame(() => this.animate());
    } else {
      this.cancelAnimation();
    }
  };
}
