import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {


  constructor() { }

  ngOnInit() {
   this.moveBoard();
  }

  moveBoard(){

    setTimeout(function(){
      let boardStart = document.querySelector("div.board-start");
     
      if (boardStart) {
        boardStart.className = "board-end";
      } 
    }, 10)

    
  }

}
