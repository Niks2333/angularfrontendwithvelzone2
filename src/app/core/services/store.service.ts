import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
    private baseUrl = `${environment.apiBaseUrl}/store`;
  private apiUrl = 'http://localhost:56262/api/store/list'; // 🔹 Your API URL

  constructor(private http: HttpClient) {}

  // Get all stores
  getStores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add new store
  addStore(store: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, store);
  }
  // Get stock for specific store
getStockByStore(storeName: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:56262/api/store/${storeName}/stock`);
}
  getStoreTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/store/storetypes`);
  }
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/store/productlist`);
  }
    updateStoreWithProducts(formData: FormData) {
    return this.http.post(`${environment.apiBaseUrl}/store/update-with-products`, formData);
  }

  getStoreWithProducts(storeName: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/store/get-with-products/${encodeURIComponent(storeName)}`);
  }
    addStoreWithProducts(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/store/add-with-products`, formData);
  }

}
