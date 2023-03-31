import { Component, NgZone } from "@angular/core";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { AppService } from "./app.service";
import { TranslateService } from "@ngx-translate/core";
import { ChangeLanguageService } from "../services/change-language.service";
import { NotificationService } from "../services/notification.service";
import { UserDataService } from "../services/user-data.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [
    ":host { display: block; }",
    ":host /deep/ .layout-loading .sidenav-link { transition: none !important; }",
  ],
})
export class AppComponent {
  isRTL = false;
  constructor(
    private router: Router,
    private appService: AppService,
    private zone: NgZone,
    public translate: TranslateService,
    public ChangeLanguageService: ChangeLanguageService,
    public myTool: NotificationService,
    private userDataService: UserDataService,
  ) {

    this.userDataService.checkBlockUnblockUser();
    // Subscribe to router events to handle page transition
    this.router.events.subscribe(this.navigationInterceptor.bind(this));
    // Disable animations and transitions in IE10 to increase performance
    // this.exec(() => this.themeSettings.setMaterial(rtl));
    // this.translate.onLangChange.subscribe((resp: any) => {
    //   this.isRTL = resp.lang == 'ar';
    // });
    // this.setDefaultLanguage()
    this.ChangeLanguageService.getSetLang();
    if (this.ChangeLanguageService.checkLang() == 'en') {
      this.isRTL = false;
    } else if (this.ChangeLanguageService.checkLang() == 'ar') {
      this.isRTL = true;
    } else {
      this.isRTL = true;
    }
    if (
      typeof document["documentMode"] === "number" &&
      document["documentMode"] < 11
    ) {
      const style = document.createElement("style");
      style.textContent = `
        * {
          -ms-animation: none !important;
          animation: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }`;
      document.head.appendChild(style);
    }
  }

  private navigationInterceptor(e: RouterEvent) {
    if (e instanceof NavigationStart) {
      // Set loading state
      // document.body.classList.add("app-loading");
    }

    if (e instanceof NavigationEnd) {
      // Scroll to top of the page
      this.appService.scrollTop(0, 0);
    }

    if (
      e instanceof NavigationEnd ||
      e instanceof NavigationCancel ||
      e instanceof NavigationError
    ) {
      // On small screens collapse sidenav

      // Remove loading state
      document.body.classList.remove("app-loading");
    }
  }
}
