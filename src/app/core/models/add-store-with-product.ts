export class ProductWithOptionalImage {
  productId = 0;
  storePrice = 0;
  stock = 0;
  imagePath?: string;

  constructor(init?: Partial<ProductWithOptionalImage>) {
    Object.assign(this, init);
  }
}

export class AddStoreWithProducts {
  storeName = '';
  storeTypeId = 0;
  createdBy = '';
  products: ProductWithOptionalImage[] = [];

  constructor(init?: Partial<AddStoreWithProducts>) {
    Object.assign(this, init);

    
    this.products = (init?.products || []).map(p => new ProductWithOptionalImage(p));
  }
}
