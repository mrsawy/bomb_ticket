import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  accordionsCount = 24;
  accordionStates: boolean[] = [];
  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.accordionsCount; i++) { this.accordionStates.push(true); }
  }

}
