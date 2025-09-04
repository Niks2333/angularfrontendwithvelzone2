import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Services & Models
import { StoreService } from 'src/app/core/services/store.service';

import { AddStoreWithProducts, ProductWithOptionalImage } from 'src/app/core/models/add-store-with-product';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';
// Velzon Breadcrumb Component
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-store-add',
  standalone: true,
  imports: [CommonModule, FormsModule,  SharedModule],
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.scss']
})
export class StoreAddComponent implements OnInit {

  breadCrumbItems: Array<{ label: string; active?: boolean }> = [];

  model = new AddStoreWithProducts({ createdBy: 'Niks23' });
  productImageFiles: (File | null)[] = [];
  storeTypes: any[] = [];
  products: { productId: number; productName: string }[] = [];
  isEditMode = false;
 backendImageUrl2 = 'http://localhost:56262/Content/images/';

  constructor(
    private storeService: StoreService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadStoreTypes();
    this.loadProducts();

    this.route.paramMap.subscribe(params => {
      const storeName = params.get('storeName');
      if (storeName) {
        this.isEditMode = true;
        this.loadStoreDetails(storeName);
      } else {
        this.isEditMode = false;
        this.addProduct();
      }

   
      this.breadCrumbItems = [
        { label: 'Dashboard' },
        { label: 'Stores' },
        { label: this.isEditMode ? 'Edit Store' : 'Add Store', active: true }
      ];
    });
  }

  loadStoreTypes() {
    this.storeService.getStoreTypes().subscribe(data => {
      this.storeTypes = data.map(t => ({
        storeTypeId: t.StoreTypeId,
        storeTypeName: t.StoreTypeName
      }));
    });
  }

 
  loadProducts() {
    this.storeService.getAllProducts().subscribe(data => {
      this.products = data.map(p => ({
        productId: p.ProductId,
        productName: p.ProductName
      }));
    });
  }

  loadStoreDetails(storeName: string) {
    this.storeService.getStoreWithProducts(storeName).subscribe(storeData => {
      this.model = new AddStoreWithProducts({
        storeName: storeData.StoreName,
        storeTypeId: storeData.StoreTypeId,
        createdBy: storeData.CreatedBy,
        products: (storeData.Products || []).map((prod: any) => ({
          productId: prod.ProductId,
          storePrice: prod.StorePrice,
          stock: prod.Stock,
          imagePath: prod.ImagePath || ''
        }))
      });

      this.productImageFiles = new Array(this.model.products.length).fill(null);

   
      this.breadCrumbItems[this.breadCrumbItems.length - 1] = { label: 'Edit Store', active: true };
    });
  }

  addProduct() {
    this.model.products.push(new ProductWithOptionalImage());
    this.productImageFiles.push(null);
  }

  removeProduct(index: number) {
    this.model.products.splice(index, 1);
    this.productImageFiles.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  getFilteredProducts(currentIndex: number) {
    const selectedIds = this.model.products
      .filter((p, idx) => idx !== currentIndex && p.productId > 0)
      .map(p => p.productId);

    return this.products.filter(prod =>
      !selectedIds.includes(prod.productId) ||
      prod.productId === this.model.products[currentIndex].productId
    );
  }

  onProductImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    this.productImageFiles[index] = file || null;
  }

  onSubmit() {
  debugger;
    const formData = new FormData();
    formData.append('model', JSON.stringify(this.model));

    this.productImageFiles.forEach((file, index) => {
      if (file) {
        formData.append(`productImage_${index}`, file);
      }
    });

    if (this.isEditMode) {
      this.storeService.updateStoreWithProducts(formData).subscribe({
        next: () => {
          Swal.fire({
            title: '🎉 Store Updated!',
            text: 'The store and products were updated successfully.',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true
          }).then(() => this.router.navigateByUrl('/stores'));
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong while updating the store.',
            icon: 'error'
          });
        }
      });
    } else {
      this.storeService.addStoreWithProducts(formData).subscribe({
        next: () => {
          Swal.fire({
            title: '🎉 Store Added!',
            text: 'The store and products were added successfully.',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true
          }).then(() => this.router.navigateByUrl('/'));
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong while adding the store.',
            icon: 'error'
          });
        }
      });
    }
  }
}
