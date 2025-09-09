import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreStockService } from 'src/app/core/services/stock.service';
import { StoreProductViewModel } from 'src/app/core/models/store-product-view.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgLabelTemplateDirective, NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router'; 
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-stock',
  standalone: true,
  templateUrl: './store-stock.component.html',
  styleUrls: ['./store-stock.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    RouterModule
  ],
  providers: [DatePipe]
})
export class StoreStockComponent implements OnInit {

  Math = Math;
  storeName = '';
  stockData?: StoreProductViewModel;
  backendImageUrl = 'http://localhost:56262/Content/images/';
  fallbackImage = 'assets/images/image-not-found.png';
  breadCrumbItems!: Array<{}>;

  successMessage = '';
  categoryDropdownList: any[] = [];

  filters = {
    storeName: '',
    search: '',
    SelectedCategories: [] as string[],
    page: 1,
    pageSize: 5,
    sortColumn: 'ProductName',
    sortOrder: 'ASC' as 'ASC' | 'DESC'
  };

  startIndex = 0;
  endIndex = 0;
  totalPages = 1;
  filteredData: any[] = [];
  categories: string[] = [];
  pageSizes = [5, 10, 20, 50];

  constructor(
    private stockService: StoreStockService,
    private route: ActivatedRoute,
    private router: Router,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {
    const nameFromRoute = this.route.snapshot.paramMap.get('storeName') || '';
    this.storeName = nameFromRoute;
    this.filters.storeName = nameFromRoute;
    this.fetchStock();
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Store List' },
      {label:'stock',active:true}
    ];
  }


  fetchStock() {
    this.stockService.getStockWithParams(this.filters).subscribe({
      next: (data) => {
        this.stockData = data;
        this.categories = data.Categories || [];
        this.categoryDropdownList = this.categories.map(c => ({ value: c }));
        this.totalPages = Math.ceil((data.TotalCount || 0) / this.filters.pageSize) || 1;
        debugger;
      },
      error: (err) => {
        console.error('Error fetching stock', err);
      }
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.fetchStock();
  }

  sortData(column: string) {
    if (this.filters.sortColumn === column) {
      this.filters.sortOrder = this.filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.filters.sortColumn = column;
      this.filters.sortOrder = 'ASC';
    }
    this.fetchStock();
  }

  // getSortArrow(column: string): string {
  //   if (this.filters.sortColumn === column) {
  //     return this.filters.sortOrder === 'ASC' ? '▲' : '▼';
  //   }
  //   return '⇅';
  // }

  // downloadExcel() {
  //   if (this.stockData && this.stockData.Products) {
  //     console.log('Export to Excel:', this.stockData.Products);
  //     // this.excelService.exportToExcel(this.stockData.Products, 'Productslist');
  //   }
  // }

deleteStock(product: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this stock!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.stockService.deleteStock(product.StoreProductId).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Stock has been deleted successfully.', 'success');
          this.applyFilters();
        },
        error: (err) => {
          console.error('Delete error', err);
          Swal.fire('Error', 'Something went wrong while deleting.', 'error');
        }
      });
    }
  });
}


  // updatePagination() {
  //   const totalItems = this.filteredData.length;
  //   this.totalPages = Math.ceil(totalItems / this.filters.pageSize) || 1;
  //   this.startIndex = (this.filters.page - 1) * this.filters.pageSize;
  //   this.endIndex = Math.min(this.startIndex + this.filters.pageSize, totalItems);
  // }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.fetchStock();
    }
  }
  openFilter(content: any) {
  this.offcanvasService.open(content, { position: 'end' });
}

resetFilters() {
  this.filters.search = '';
  this.filters.SelectedCategories = [];
  this.filters.pageSize = 5;
  this.filters.page = 1;
  this.fetchStock();
}
  reloadData() {
    this.fetchStock();
  }

  navigateBack() {
    this.router.navigate(['/']);
  }


  get paginatedData() {
    return this.filteredData;
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addStock() {
    this.router.navigate(['/add-stock', { storeName: this.storeName }]);
  }
}
