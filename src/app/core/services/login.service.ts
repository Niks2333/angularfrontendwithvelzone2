import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginModel {
  Username: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${environment.apiBaseUrl}/Account`; 
  
  private tokenKey = 'token';
  private userKey = 'currentUser';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = JSON.parse(sessionStorage.getItem(this.userKey) || 'null');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

login(loginData: LoginModel): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
    tap(response => {
      debugger;
      if (response && response.token) {
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userKey, response.Username); 
            console.log("Stored token:", sessionStorage.getItem(this.tokenKey));
    console.log("Stored username:", sessionStorage.getItem(this.userKey));
        this.currentUserSubject.next(response.Username);
      }
    })
  );
}

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

    validateToken(): Observable<boolean> {
    if (!this.getToken()) {
      return of(false); 
    }

    return this.http.post<any>(`${this.apiUrl}/ValidateToken`, {}).pipe(
      map(() => true),          
      catchError(() => of(false)) 
    );
  }
    getStoreTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/store/storetypes`);
  }
  
}
