import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { CouponService } from "../../../../../services/coupon.service";

@Component({
  selector: 'app-my-coupons',
  templateUrl: './my-coupons.component.html',
  styleUrls: ['./my-coupons.component.scss',
    "../../../../../vendor/libs/spinkit/spinkit.scss",]
})
export class MyCouponsComponent implements OnInit {

  filterVal = "";
  searchKeys = [
    "name",
    "percentOff",
  ];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  couponsData: any = [];
  originalCouponsData = [];
  url = environment.BaseUrl;
  loading;
  editId;
  editIndex = 0;
  ticket;
  constructor(
    private couponService: CouponService,
  ) {
    this.loadData();
  }

  ngOnInit() { }

  loadData() {
    this.loading = true;
    this.couponService.getMyCoupons().subscribe(
      (data: any) => {
        this.originalCouponsData = data.couponsData;
        this.loading = false;
        this.update();
      },
      (err) => {
        this.loading = false;
      }
    );
  }


  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    const data = this.filter(this.originalCouponsData);
    this.totalItems = data.length;
    this.sort(data);
    this.couponsData = this.paginate(data);
  }
  filter(data) {
    const filter = this.filterVal.toLowerCase();
    return !filter
      ? data.slice(0)
      : data.filter((d) => {
        return (
          Object.keys(d)
            .filter((k) => this.searchKeys.includes(k))
            .map((k) => String(d[k]))
            .join("|")
            .toLowerCase()
            .indexOf(filter) !== -1 || !filter
        );
      });
  }
  sort(data) {
    data.sort((a: any, b: any) => {
      a =
        typeof a[this.sortBy] === "string"
          ? a[this.sortBy].toUpperCase()
          : a[this.sortBy];
      b =
        typeof b[this.sortBy] === "string"
          ? b[this.sortBy].toUpperCase()
          : b[this.sortBy];
      if (a < b) {
        return this.sortDesc ? 1 : -1;
      }
      if (a > b) {
        return this.sortDesc ? -1 : 1;
      }
      return 0;
    });
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }
  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }
    this.currentPage = 1;
    this.update();
  }
}
