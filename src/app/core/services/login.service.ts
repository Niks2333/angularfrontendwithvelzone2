import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginModel {
  Username: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${environment.apiBaseUrl}/Account`; // 🔹 your backend URL
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

// service
login(loginData: LoginModel): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
    tap(response => {
      if (response && response.token) {
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userKey, response.Username); 
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
}
