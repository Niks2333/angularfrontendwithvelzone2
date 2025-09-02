export class WebEditStockViewModel {
  StoreProductId = 0;
  StorePrice = 0;
  Stock = 0;
  StoreName = '';
  ProductName = '';
  ImagePath?: string;
  ImageFile?: File;

  constructor(init?: Partial<WebEditStockViewModel>) {
    Object.assign(this, init); 
  }
}
