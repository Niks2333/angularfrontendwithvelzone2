export class WebAddStockViewModel {
  StoreName = '';
  ProductName = '';
  StorePrice = 0;
  Stock = 0;
  ImageFile?: File;
  AvailableProducts?: string[];

  constructor(storeName?: string) {
    if (storeName) {
      this.StoreName = storeName;
    }
  }
}
