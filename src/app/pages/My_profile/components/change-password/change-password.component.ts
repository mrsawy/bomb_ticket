import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../../../../services/notification.service";
import { ProfileService } from "../../../../../services/profile.service";
import { UserDataService } from "../../../../../services/user-data.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassword = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  loading = false;
  constructor(
    public myTool: NotificationService,
    public profileServices: ProfileService,
    public translateService: TranslateService,
    public userData: UserDataService,
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

  ngOnInit() {}
  isArLng() {
    return this.userData.isLngAr();
  }
  changePasswordBtn() {
    if (
      (this.changePassword.newPassword &&
        this.changePassword.confirmPassword &&
        this.changePassword.oldPassword) == ""
    ) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
    } else {
      if (
        this.changePassword.newPassword != this.changePassword.confirmPassword
      ) {
        this.myTool.showMyAlert("danger", this.dataError.passwordNotMatch);
      } else {
        this.loading = true;
        let id = JSON.parse(localStorage.getItem("userId-ticket"));
        this.profileServices.changePassword(id, this.changePassword).subscribe(
          (resp: any) => {
            this.loading = false;
            this.changePassword = {
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            };

            this.myTool.showMyAlert("success", this.dataSuccess.passwordChangeSuccessFully);
          },
          (err) => {
            this.loading = false;
            if (
              err.error.error == "Password should be greater than 6 characters!"
            ) {
              this.myTool.showMyAlert(
                "danger",
                this.dataError.passwordMustGreaterThan_6Letter
              );
            } else if (err.error.error == "Invalid old password!") {
              this.myTool.showMyAlert("danger", this.dataError.invalidOldPassword);
            }
          }
        );
      }
    }
  }
}
