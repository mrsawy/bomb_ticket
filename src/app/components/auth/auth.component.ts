import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../../services/auth.service";
import { NotificationService } from "../../../services/notification.service";
import { UploaderService } from "../../../services/uploader.service";
import { UserDataService } from "../../../services/user-data.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: [
    "./auth.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
    "../../../vendor/styles/pages/authentication.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../vendor/libs/ng-select/ng-select.scss",
  ],
})
export class AuthComponent implements OnInit {
  loading = false;
  url = environment.BaseUrl;
  @ViewChild("editModal") content: TemplateRef<any>;
  credentials = {
    phoneNumber: "",
    password: "",
  };
  registerData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "male",
    email: "",
    password: "",
  };
  login = true;
  forgotPassword = false;
  forgotData = {
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  };
  userId;
  verificationCodeApi;
  type = "email";
  openModel;
  allEvent = [];
  eventId;
  cardDetails = true;
  ticketCardDetails = false;
  eventData = {
    createdAt: "",
    dateTime: "",
    eventImg: "",
    id: 0,
    lat: "",
    lng: "",
    location: "",
    subtitle: "",
    termsAndCondition: "",
    title: "",
    updatedAt: "",
  };
  dataSuccess: any;
  dataError: any;
  dataAuth: any;
  constructor(
    public modalService: NgbModal,
    public myTool: NotificationService,
    public authServices: AuthService,
    public appServices: AppService,
    public uploaderServices: UploaderService,
    public userData: UserDataService,
    public translateService: TranslateService
  ) {
    translateService.get("dataSuccess").subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get("dataError").subscribe((resp: any) => {
      this.dataError = resp;
    });
    translateService.get("auth").subscribe((resp: any) => {
      this.dataAuth = resp;
    });
  }
  isArLng() {
    return this.userData.isLngAr();
  }

  ngOnInit() {}
  ngAfterContentInit() {
    // if (!JSON.parse(localStorage.getItem("user-ticket"))) {
      setTimeout(() => {
        // document.getElementById("OPENModal").click();
        this.openModal(this.content, null, null);
      }, 599);
    // }
  }

  loginBtn() {
    this.loading = true;
    if ((this.credentials.phoneNumber && this.credentials.password) == "") {
      this.myTool.showMyAlert(
        "danger",
        this.dataError.pleaseEnterYourEmailAndPassword
      );
    } else {
      this.authServices.login(this.credentials).subscribe(
        (resp: any) => {
          this.modalService.dismissAll();
          this.myTool.showMyAlert(
            "success",
            this.dataSuccess.userLoginSuccessfully
          );
          localStorage.setItem("user-ticket", JSON.stringify(resp.user));
          localStorage.setItem("userId-ticket", JSON.stringify(resp.user.id));

          this.loading = false;
        },
        (err) => {
          this.loading = false;
          if (err.error.error == "You are blocked by Admin")
            this.myTool.showMyAlert(
              "danger",
              this.dataError.youAreBlockedByAdmin
            );
          else if (err.error.error == "Password is incorrect!")
            this.myTool.showMyAlert(
              "danger",
              this.dataError.passwordIsIncorrect
            );
          else if (err.error.error == "Email does not exist!")
            this.myTool.showMyAlert("danger", this.dataError.emailDoesNotExist);
        }
      );
    }
  }
  registerBtn() {
    this.loading = true;
    if (
      (this.registerData.email &&
        this.registerData.password &&
        this.registerData.firstName &&
        this.registerData.lastName &&
        this.registerData.phoneNumber) == ""
    ) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
      this.loading = false;
    } else {
      this.authServices.register(this.registerData).subscribe(
        (resp: any) => {
          this.myTool.showMyAlert(
            "success",
            this.dataSuccess.accountSuccessfullyCreated
          );
          localStorage.setItem("user-ticket", JSON.stringify(resp.user));
          localStorage.setItem("userId-ticket", JSON.stringify(resp.user.id));
          this.loading = false;
          this.modalService.dismissAll();
          this.registerData = {
            firstName: "",
            gender:'',
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
          };
        },
        (err) => {
          this.loading = false;

          if (err.error.error == "Email already Exits!")
            this.myTool.showMyAlert("danger", this.dataError.emailOrPhoneNumberAlreadyExits);
          else if (
            err.error.error == "Password should be greater than 6 characters!"
          )
            this.myTool.showMyAlert(
              "danger",
              this.dataError.passwordShouldBeGreaterThan_6Characters
            );
        }
      );
    }
  }
  signUp() {
    this.login = !this.login;
  }
  back() {
    if (this.type == "email") {
      this.login = true;
      this.forgotPassword = false;
    } else if (this.type == "verify") {
      this.type = "email";
    } else if (this.type == "password") {
      this.type = "verify";
    }
  }
  header() {
    let header;
    if (this.type == "email") {
      header = this.dataAuth.forgotPasswordHeader;
    } else if (this.type == "verify") {
      header = this.dataAuth.Verification;
    } else if (this.type == "password") {
      header = this.dataAuth.resetPassword;
    }
    return header;
  }
  forgotBtnText() {
    let header;
    if (this.type == "email") {
      header = this.dataAuth.continue;
    } else if (this.type == "verify") {
      header = this.dataAuth.Verify;
    } else if (this.type == "password") {
      header = this.dataAuth.resetPassword;
    }
    return header;
  }
  forgotPasswordclick() {
    this.forgotPassword = true;
  }

  forgotPasswordBtn() {
    if (this.type == "email") {
      this.loading = true;
      this.authServices.forgot_password(this.forgotData).subscribe(
        (resp: any) => {
          this.loading = false;
          this.userId = resp.user.id;
          this.verificationCodeApi = resp.verificationCode;
          this.type = "verify";
        },
        (err) => {
          this.loading = false;
          if (err.error.error == "Email does not exist")
            this.myTool.showMyAlert("danger", this.dataError.emailDoesNotExist);
          else if (
            err.error.error == "Error occurred while sending Verification Code"
          )
            this.myTool.showMyAlert(
              "danger",
              this.dataError.errorOccurredWhileSendingVerificationCode
            );
        }
      );
    } else if (this.type == "verify") {
      if (this.forgotData.code == this.verificationCodeApi) {
        this.type = "password";
      } else {
        this.myTool.showMyAlert("danger", this.dataError.invalidCode);
      }
    } else if (this.type == "password") {
      if (this.forgotData.password == this.forgotData.confirmPassword) {
        if (this.forgotData.password.length < 6) {
          this.myTool.showMyAlert(
            "danger",
            this.dataError.passwordMustGreaterThan_6Letter
          );
        } else {
          this.loading = true;
          this.authServices
            .update_user_password(this.userId, this.forgotData)
            .subscribe(
              (resp: any) => {
                this.myTool.showMyAlert(
                  "success",
                  this.dataSuccess.passwordChangeSuccessFully
                );

                this.loading = false;
                this.login = true;
              },
              (err) => {
                this.loading = false;
              }
            );
        }
      } else {
        this.myTool.showMyAlert("danger", this.dataError.passwordNotMatch);
      }
    }
  }

  modalDismiss() {
    this.modalService.dismissAll();
    // if (!JSON.parse(localStorage.getItem("user-ticket"))) {
      // setTimeout(() => {
        // this.openModal(this.content, null, null);
      // }, 1500);
    // }
  }
  openModal(targetModal, item, index) {
    this.openModel = true;
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
}
