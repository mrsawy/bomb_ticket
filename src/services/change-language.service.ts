import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageService {
  constructor(
    public translate: TranslateService,

  ) { }

  getSetLang() {
    this.translate.addLangs(['en', 'ar']);
    if (localStorage.getItem('ticketLang')) {
      if (localStorage.getItem('ticketLang') == 'en') {
        this.translate.setDefaultLang('en');
      } else {
        this.translate.setDefaultLang('ar');
      }
    } else {
      localStorage.setItem('ticketLang', 'ar');
      this.translate.setDefaultLang('ar');
    }
  }

  setLang(event) {
    this.translate.setDefaultLang(event);
    localStorage.setItem('ticketLang', event)
  }

  checkLang() {
    let result = null;
    if (localStorage.getItem('ticketLang') == 'en') {
      result = 'en';
    } else if (localStorage.getItem('ticketLang') == 'ar') {
      result = 'ar';
    } else {
      result = null;
    }
    return result;
  }
}
