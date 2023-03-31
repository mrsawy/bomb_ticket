import { Component, Input, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: [
    "./carousel.component.scss",
    "../../../vendor/libs/ngx-swiper-wrapper/ngx-swiper-wrapper.scss",
  ],
})
export class CarouselComponent implements OnInit {

  url = environment.BaseUrl;
  @Input() images = [];
  @Input() loading = true;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    // Trigger resize event to redraw swiper
    setTimeout(() => {
      if (document.createEvent) {
        let event:any ;

        if (
          typeof document["documentMode"] === "number" &&
          document["documentMode"] > 10
        ) {
          event = document.createEvent("Event");
          event.initEvent("resize", false, true);
        } else {
          event = new Event("resize");
        }

        window.dispatchEvent(event);
      } else {
        window["fireEvent"]("onresize", document["createEventObject"]());
      }
    }, 90);
  }
}
