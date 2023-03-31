import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { OrderService } from '../../../../../services/order.service';

@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.scss',
  "../../../../../vendor/libs/spinkit/spinkit.scss",
],
})
export class SellerOrderComponent implements OnInit {

  filterVal = "";
  searchKeys = [
    "firstName",
    "lastName",
    "id",
    "orderNumber",
    "price",
    "createdAt",
  ];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData: any = [];
  originalProductsData = [];
  url = environment.BaseUrl;
  loading;
  editId;
  editIndex = 0;
  ticket;
  constructor(
    public orderService : OrderService,
    private modalService: NgbModal,
  ) {
    this.loadData();
  }

  ngOnInit() {}
  loadData() {
    this.loading = true;
    let id = JSON.parse(localStorage.getItem("userId-ticket"));
    this.orderService.getSellerOrder(id).subscribe(
      (data: any) => {
        this.originalProductsData = data.slice(0);
        this.loading = false;
        this.update();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  openModal(targetModal, item, index, type) {
    this.editIndex = index;
    if (item) {
      this.ticket = item
    } else {
   
    }

    this.modalService.open(targetModal, {
      centered: true,
      size: 'lg',
      backdrop: "static",
    });
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    const data = this.filter(this.originalProductsData);
    this.totalItems = data.length;
    this.sort(data);
    this.productsData = this.paginate(data);
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
