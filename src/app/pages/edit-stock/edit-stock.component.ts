import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreStockService } from 'src/app/core/services/stock.service';
import { WebEditStockViewModel } from '../../core/models/web-edit-stock.model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-stock',
  standalone: true,
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss'],
  imports: [FormsModule,CommonModule]
  
})
export class EditStockComponent implements OnInit {
  model = new WebEditStockViewModel();
  selectedFile?: File;
  backendImageUrl = environment.apiBaseUrl + '/Content/images/';
  imagePreview = '';
  stockId!: number;
  storeName!: string; // ✅ to redirect back

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StoreStockService
  ) {}

  ngOnInit(): void {
    this.stockId = Number(this.route.snapshot.paramMap.get('id'));
    this.storeName = this.route.snapshot.queryParamMap.get('storeName') || ''; // keep store name
    if (this.stockId) {
      this.loadStockData();
    }
  }

  loadStockData() {
    this.stockService.getEditStockFormData(this.stockId).subscribe({
      next: (data) => {
        this.model = new WebEditStockViewModel(data);
        this.imagePreview = data.ImagePath ? this.backendImageUrl + data.ImagePath : '';
      },
      error: (err) => console.error(err)
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.model.StorePrice < 0 || this.model.Stock < 0) {
      return;
    }

    const formData = new FormData();
    formData.append('model', JSON.stringify(this.model));
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.stockService.updateStock(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            title: '✅ Success!',
            text: 'Product updated successfully.',
            icon: 'success',
            confirmButtonColor: '#364574',
            confirmButtonText: 'OK'
          }).then(() => {
            // redirect back to stock page with storeName
            this.router.navigate([`/store/${this.storeName}/stock`]);
          });
        } else {
          Swal.fire({
            title: '❌ Error',
            text: res.message,
            icon: 'error',
            confirmButtonColor: '#364574'
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: '❌ Error',
          text: 'Something went wrong while updating!',
          icon: 'error',
          confirmButtonColor: '#364574'
        });
        console.error(err);
      }
    });
  }
}
