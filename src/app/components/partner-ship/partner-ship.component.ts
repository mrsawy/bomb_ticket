import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PartnerShipService } from '../../../services/partner-ship.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-partner-ship',
  templateUrl: './partner-ship.component.html',
  styleUrls: ['./partner-ship.component.scss']
})
export class PartnerShipComponent implements OnInit {
  partnerShip = []
  url = environment.BaseUrl;
  constructor(public PartnerShipService :PartnerShipService , public userData:UserDataService ) { }

  ngOnInit() {
    this.PartnerShipService.getAllPartnerShip().subscribe((resp:any)=>{
      this.partnerShip = resp
    })
  }
  isArLng() {
    return this.userData.isLngAr();
  }
}
