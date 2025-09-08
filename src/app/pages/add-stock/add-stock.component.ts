import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreStockService } from 'src/app/core/services/stock.service';
import { WebAddStockViewModel } from 'src/app/core/models/addStockModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],

})
export class AddStockModalComponent implements OnInit {
  backendImageUrl = 'http://localhost:56262/Content/images/';
  model!: WebAddStockViewModel;
  availableProducts: string[] = [];
  selectedFile?: File;
  storeName!: string;

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StoreStockService
  ) { }
  ngOnInit(): void {
  this.storeName = this.route.snapshot.paramMap.get('storeName') || '';
    this.model = new WebAddStockViewModel(this.storeName);


    this.stockService.getAddStockFormData(this.storeName).subscribe({
      next: (data) => {
        this.availableProducts = data.AvailableProducts ?? [];
      },
      error: (err) => {
        console.error('Failed to fetch available products', err);
      }
    });
  }
close()
{
    this.router.navigate([`/store/${this.storeName}/stock`]); 
}
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit(): void {
    if (!this.model.ProductName || this.model.StorePrice <= 0 || this.model.Stock < 0) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('Data', JSON.stringify(this.model));
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.stockService.addStock(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Stock added successfully.');
          this.router.navigate([`/store/${this.storeName}/stock`]);
        } else {
          alert(res.message || 'Failed to add stock.');
        }
      },
      error: () => {
        alert('Error occurred while adding stock.');
      }
    });
  }


}
