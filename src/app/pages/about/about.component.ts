import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  accordionsCount = 24;
  accordionStates: boolean[] = [];
  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.accordionsCount; i++) { this.accordionStates.push(true); }
  }

}
