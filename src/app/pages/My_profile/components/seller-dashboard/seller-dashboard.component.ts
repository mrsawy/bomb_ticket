import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DashboardService } from "../../../../../services/dashboard.service";

@Component({
  selector: "app-seller-dashboard",
  templateUrl: "./seller-dashboard.component.html",
  styleUrls: ["./seller-dashboard.component.scss"],
})
export class SellerDashboardComponent implements OnInit {
  //chart6Data
  chart6Data = [
    {
      data: [0, 0, 0],
      borderWidth: 1,
    },
  ];
  chart6Options = {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    legend: {
      position: "right",
      labels: {
        boxWidth: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  chart6Colors = [
    {
      backgroundColor: [
        "rgba(255, 193, 7, 0.5)",
        "rgba(25, 135, 84, 0.5)",
        "rgba(220, 53, 69, 0.5)",
      ],
      borderColor: ["#ffc107", "#198754", "#dc3545"],
    },
  ];
  chart6Title =
    ['Pending', 'Approved', 'Rejected'];
  chart6ColorsOrder = [
    {
      backgroundColor: [
        "rgba(33 ,52 ,88, 0.5)",
        "rgba(25, 135, 84, 0.5)",
        "rgba(220, 53, 69, 0.5)",
      ],
      borderColor: ["#2f3337 ", "#198754", "#dc3545"],
    },
  ];
  dashboardData = {
    totalEarningOSellers: 0,
    pendingTicketCount: 0,
    approvedTicketCount: 0,
    rejectedTicketCount: 0,
    totalEarningOSellersThisMouth: 0,
    getSoldOderCount: 0,
    getUnSoldOrderCount: 0,
    getAllSellerOrderCount: 0,
    getAllSellerTicketCount: 0,
    TicketStats: [0, 0, 0],
    orderStats: [0, 0],
  };
  // Chart 1
  //

  chart1Data = [
    {
      label: "Visits",
      data: [93, 25, 95, 59, 46, 68, 4, 41],
      borderWidth: 1,
    },
    {
      label: "Returns",
      data: [83, 1, 43, 28, 56, 82, 80, 66],
      borderWidth: 1,
      borderDash: [5, 5],
    },
  ];
  chart1Options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#aaa",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#aaa",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  chart1Colors = [
    {
      backgroundColor: "rgba(28,180,255,.05)",
      borderColor: "rgba(28,180,255,1)",
    },
    {
      backgroundColor: "rgba(136, 151, 170, 0.1)",
      borderColor: "#8897aa",
    },
  ];
  chart1date = [
    "2016-10",
    "2016-11",
    "2016-12",
    "2017-01",
    "2017-02",
    "2017-03",
    "2017-04",
    "2017-05",
  ];
  dataDashboard: any;
  constructor(public dashboardService: DashboardService, public translateService: TranslateService
  ) {
    translateService.get("sellerDashboard").subscribe((resp: any) => {
      this.dataDashboard = resp;
      this.chart6Title[0] = resp.pending
      this.chart6Title[1] = resp.approved
      this.chart6Title[2] = resp.rejected
    });

  }

  ngOnInit() {

    let id = JSON.parse(localStorage.getItem("userId-ticket"));
    this.dashboardService.sellerDashboard(id).subscribe((resp: any) => {
      this.dashboardData = resp;
      this.configChart();
    });
  }
  configChart() {
    this.chart6Data = [
      {
        data: this.dashboardData.TicketStats,
        borderWidth: 1,
      },
    ];
    // this.chartOrderData = [
    //   {
    //     data: this.dashboardData.orderStats,
    //     borderWidth: 1,
    //   },
    // ];
  }
}
