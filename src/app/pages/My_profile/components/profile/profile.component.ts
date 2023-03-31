import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../../../environments/environment";
import { NotificationService } from "../../../../../services/notification.service";
import { ProfileService } from "../../../../../services/profile.service";
import { UploaderService } from "../../../../../services/uploader.service";
import { UserDataService } from "../../../../../services/user-data.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  Id;
  url = environment.BaseUrl;
  firstName;
  lastName;
  profileImg;
  phoneNumber;
  userData = {
    firstName: "",
    lastName: "",
    profileImg: "",
    phoneNumber: "",
  };
  loading = false;
  constructor(
    public profileService: ProfileService,
    public myTool: NotificationService,
    public UploaderService: UploaderService,
    public translateService: TranslateService,
    public userDataService: UserDataService,
    ) {
      translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
    }
    dataSuccess: any;
    dataError: any;
    isArLng() {
      return this.userDataService.isLngAr();
    }
  ngOnInit() {
    this.Id = JSON.parse(localStorage.getItem("userId-ticket"));
    this.userData = JSON.parse(localStorage.getItem("user-ticket"));
    this.profileImg = this.userData.profileImg;
    this.firstName = this.userData.firstName;
    this.lastName = this.userData.lastName;
    this.phoneNumber = this.userData.phoneNumber;
  }
  profileImage() {
    JSON.parse(localStorage.getItem("user-ticket"));
    let profileImg = JSON.parse(localStorage.getItem("user-ticket")).profileImg;
    return profileImg;
  }
  fileBtn() {
    document.getElementById("uploadFile").click();
  }
  onFileChange(event: any) {
    this.UploaderService.uploadImage(event.target.files[0]).subscribe(
      (resp: any) => {
        this.userData = JSON.parse(localStorage.getItem("user-ticket"));
        this.userData.profileImg = resp;
        this.profileImg = this.userData.profileImg;
        this.updateBtn()
        localStorage.setItem("user-ticket", JSON.stringify(this.userData));
      }
    );
  }

  updateBtn() {
    this.userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      profileImg: this.profileImg,
      phoneNumber: this.phoneNumber,
    };
    this.loading = true;
    this.profileService.updateProfile(this.Id, this.userData).subscribe(
      (resp: any) => {
        this.loading = false;
        localStorage.setItem("user-ticket", JSON.stringify(resp.user));
        this.myTool.showMyAlert("success", this.dataSuccess.yourProfileSuccessFullyUpdate);
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
