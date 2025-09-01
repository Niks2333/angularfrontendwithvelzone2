import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@Component({
  selector: 'app-store-list',
  standalone: true,
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    SharedModule

  ],
  providers: [DatePipe]
})
export class StoreListComponent implements OnInit {
  Math = Math;
  breadCrumbItems!: Array<{}>;
  stores: any[] = [];
  error = '';
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalRecords = 0;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Stores' },
      { label: 'Store List', active: true }
    ];
    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe({
      next: (data: any) => {
        this.stores = data;
        this.totalRecords = data.length;
      },
      error: () => (this.error = 'Failed to load stores')
    });
  }


  get filteredStores() {
    return this.stores.filter(s =>
      s.StoreName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  get paginatedStores() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStores.slice(start, start + this.pageSize);
  }

  viewStock(storeName: string) {
    this.router.navigate(['/store', storeName, 'stock']);
  }

  addStore() {
    this.router.navigate(['/store/add']);
  }

  editStore(storeName: string) {
    this.router.navigate(['/store-edit', storeName]);
  }
}
