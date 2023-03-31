import { Component, HostListener, Input, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit {
 url = environment.BaseUrl
  public innerWidth: any;
  eventSearch;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
  @Input() images = [];
  

  constructor() {}
}
