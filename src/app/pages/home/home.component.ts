import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { EventService } from "../../../services/event.service";
import { NotificationService } from "../../../services/notification.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["../../../vendor/libs/ngx-toastr/ngx-toastr.scss"],
})
export class HomeComponent implements OnInit {
  allEventsData = [];
  carouselData = [];
  carouselLoading = true;
  searchInput = "search";
  constructor(
    private appService: AppService,
    public eventService: EventService,
    public notification: NotificationService
  ) {
    this.appService.pageTitle = "Home";
  }
  ngOnInit() {
    this.eventService.getAllEvents().subscribe((resp: any) => {
      this.allEventsData = resp.allEvent;
      this.carouselData = resp.allSlider;
      setTimeout(() => {
        this.carouselLoading = false;
      }, 2000);
    });
  }
}
