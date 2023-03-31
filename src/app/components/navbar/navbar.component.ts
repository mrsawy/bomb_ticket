import { PlatformLocation } from "@angular/common";
import {
  Component,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnInit,
  PlatformRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { ChangeLanguageService } from "../../../services/change-language.service";
import { EventService } from "../../../services/event.service";
import { UserDataService } from "../../../services/user-data.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isExpanded = false;
  language = "en";
  public innerWidth: any;
  @Input() sidenavToggle = true;
  url = environment.BaseUrl;
  @HostBinding("class.layout-navbar") private hostClassMain = true;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  userData = {
    firstName: "",
    lastName: "",
    profileImg: "",
  };

  isRTL: any;
  eventDropdown = false;
  loginDiv = false;
  eventSearch = "";
  @Input() search = "";
  events = [];
  constructor(
    private appService: AppService,
    public zone: NgZone,
    public Router: Router,
    private modalService: NgbModal,
    public translate: TranslateService,
    public ChangeLanguageService: ChangeLanguageService,
    public userDataService: UserDataService,
    public eventService: EventService,
  ) {
  }
  onFocus() {
    this.eventDropdown = true;
  }
  onblur() {
    this.eventDropdown = false;
  }
  guestUser() {
    return this.userDataService.isGuestUser();
  }
  loginBtn() {
    this.loginDiv = true;
  }
  openModal(targetModal, item, index) {
    if (localStorage.getItem("ticketLang") == null) {
      localStorage.setItem("ticketLang", "en");
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  ngOnInit() {
    this.isRTL = this.appService.isRTL;
    this.innerWidth = window.innerWidth;
    if (localStorage.getItem("user-ticket")) {
      this.userData = JSON.parse(localStorage.getItem("user-ticket"));
    }
  }
  getName() {
    if (localStorage.getItem("user-ticket")) {
      this.userData = JSON.parse(localStorage.getItem("user-ticket"));
      return this.userData.firstName + " " + this.userData.lastName;
    }
  }
  getLanguage() {
    if (localStorage.getItem("ticketLang")) {
      let lang = localStorage.getItem("ticketLang");
      return lang;
    }
  }
  getProfile() {
    if (localStorage.getItem("user-ticket")) {
      this.userData = JSON.parse(localStorage.getItem("user-ticket"));
      return this.userData.profileImg;
    }
  }
  changesLanguage() {
    this.ChangeLanguageService.setLang(this.language);
    window.location.reload();
    this.modalService.dismissAll();
  }
  onItemChange(value) {
    this.language = value;
  }
  logoutBtn() {
    localStorage.clear();
    this.Router.navigate([""]);
  }
}
