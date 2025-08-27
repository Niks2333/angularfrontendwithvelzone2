import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreStockService } from 'src/app/core/services/stock.service';
import { StoreProductViewModel } from 'src/app/core/models/store-product-view.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-store-stock',
  standalone: true,
  templateUrl: './store-stock.component.html',
  styleUrls: ['./store-stock.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [DatePipe]
})
export class StoreStockComponent implements OnInit {
  // breadCrumbItems = [
  //   { label: 'Dashboard', link: '/' },
  //   { label: 'Stock', active: true }
  // ];

  storeName = '';
  stockData?: StoreProductViewModel;
  backendImageUrl = 'http://localhost:56262/Content/images/';
  fallbackImage = 'assets/images/image-not-found.png';

  successMessage = '';
  categoryDropdownList: any[] = [];

  // Filters
  filters = {
    storeName: '',
    search: '',
    SelectedCategories: [] as string[],
    page: 1,
    pageSize: 10,
    sortColumn: 'ProductName',
    sortOrder: 'ASC' as 'ASC' | 'DESC'
  };

  // pagination state
  startIndex = 0;
  endIndex = 0;
  totalPages = 1;
  filteredData: any[] = [];

  // new props for template bindings
  categories: string[] = [];  // for dropdown
  pageSizes = [5, 10, 20, 50]; // available page sizes

  constructor(
    private stockService: StoreStockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nameFromRoute = this.route.snapshot.paramMap.get('storeName') || '';
    this.storeName = nameFromRoute;
    this.filters.storeName = nameFromRoute;
    this.fetchStock();
  }

fetchStock() {
  this.stockService.getStockWithParams(this.filters).subscribe({
    next: (data) => {
      this.stockData = data;

      // Normalize keys for template
      this.filteredData = (data.Products || []).map(p => ({
        productName: p.ProductName,
        categoryName: p.CategoryName,
        price: p.StorePrice,
        stock: p.Stock,
        imageUrl: p.ImagePath 
          ? this.backendImageUrl + p.ImagePath 
          : this.fallbackImage
      }));

      this.categories = data.Categories || [];
      this.categoryDropdownList = this.categories.map(c => ({ value: c }));
      this.updatePagination();
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

  getSortArrow(column: string): string {
    if (this.filters.sortColumn === column) {
      return this.filters.sortOrder === 'ASC' ? '▲' : '▼';
    }
    return '⇅';
  }

  // downloadExcel() {
  //   if (this.stockData && this.stockData.Products) {
  //     console.log('Export to Excel:', this.stockData.Products);
  //     // this.excelService.exportToExcel(this.stockData.Products, 'Productslist');
  //   }
  // }

  // deleteStock(stock: any) {
  //   if (confirm('Are you sure you want to delete this stock?')) {
  //     this.stockService.deleteStock(stock.Id).subscribe({
  //       next: () => {
  //         this.successMessage = 'Stock deleted successfully';
  //         this.applyFilters();
  //         setTimeout(() => (this.successMessage = ''), 3000);
  //       },
  //       error: (err) => console.error('Delete error', err)
  //     });
  //   }
  // }

  updatePagination() {
    const totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(totalItems / this.filters.pageSize) || 1;
    this.startIndex = (this.filters.page - 1) * this.filters.pageSize;
    this.endIndex = Math.min(this.startIndex + this.filters.pageSize, totalItems);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.updatePagination();
    }
  }

  reloadData() {
    this.fetchStock();
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  // ---- GETTERS for template ----
  get paginatedData() {
    return this.filteredData.slice(this.startIndex, this.endIndex);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
