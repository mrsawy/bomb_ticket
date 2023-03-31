import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isRtl() {
    let result = null;
    if (localStorage.getItem('ticketLang') == 'en') {
      result = false;
    } else if (localStorage.getItem('ticketLang') == 'ar') {
      result = true;
    } else {
      result = null;
    }
    return result;
  }

}
