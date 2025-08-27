import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

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

}
