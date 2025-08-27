export interface StoreProductViewModel {
  StoreName: string;
  Products: Product[];
  Categories: string[];
  SelectedCategories: string[];
  Search: string | null;
  Page: number;
  PageSize: number;
  SortColumn: string | null;
  SortOrder: 'ASC' | 'DESC' | null;
  TotalCount: number;
}

export interface Product {
  ProductName: string;
  CategoryName: string;
  StorePrice: number;
  Stock: number;
  ImagePath: string;
  StoreProductId: number;
}
