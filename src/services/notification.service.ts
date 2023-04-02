import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public toastrService: ToastrService) {}

  tapToDismiss = true;
  closeButton = true;
  progressBar = true;
  preventDuplicates = false;
  newestOnTop = true;
  progressAnimation = "decreasing";
  positionClass = "toast-top-right";

  curMsgIndex = -1;
  showToast(message, title, color) {
    const options = {
      tapToDismiss: this.tapToDismiss,
      closeButton: this.closeButton,
      progressBar: this.progressBar,
      progressAnimation: this.progressAnimation,
      positionClass: this.positionClass,
    };

    this.toastrService.toastrConfig.newestOnTop = this.newestOnTop;
    this.toastrService.toastrConfig.preventDuplicates = this.preventDuplicates;

    this.toastrService[color](message, title, options);
  }

  clearToasts() {
    this.toastrService.clear();
  }

  
  myAlertClass = true;
  myAlertShow = false;
  myAlertType: any;
  myAlertMessage: any;

  showMyAlert(type, message:string) {
    this.myAlertType = 'dark-' + type;
    this.myAlertMessage = message;
    this.myAlertShow = true;
    setTimeout(() => {
      this.myAlertClass = false;
    }, 2500);
    setTimeout(() => {
      this.myAlertShow = false;
    }, 3000);
    setTimeout(() => {
      this.myAlertClass = true;
    }, 3500);
  }


}
