import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChangeLanguageService } from "../../../services/change-language.service";
import { ProfileService } from "../../../services/profile.service";
import { UserDataService } from "../../../services/user-data.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  contactUs = {
    subject: "",
    email: "",
    message: "",
  };
  constructor(
    public ChangeLanguageService: ChangeLanguageService,
    public ProfileService: ProfileService,
    public modalService: NgbModal,
    public userData: UserDataService
  ) {}

  ngOnInit() {}
  isArLng() {
    return this.userData.isLngAr();
  }
  openModal(targetModal, item, index) {
    if (localStorage.getItem("user-ticket")) {
      this.contactUs.email = JSON.parse(
        localStorage.getItem("user-ticket")
      ).email;
    } else {
      this.contactUs = {
        subject: "",
        email: "",
        message: "",
      };
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
  contactBtn() {
    this.ProfileService.contactUs(this.contactUs).subscribe((resp: any) => {
      this.modalService.dismissAll();
    });
  }

  changeLanguageBtn(lang) {
    this.ChangeLanguageService.setLang(lang);
    window.location.reload();
  }
}
