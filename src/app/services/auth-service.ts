// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from './token-storage';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'
import { environment } from '../../environments/environment';

interface LoginResponse {
  accessToken: string;
  // No refreshToken in body (refresh is via cookie)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private accessTokenSub = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSub.asObservable();

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      { email:username, password },
      { withCredentials: true }
    ).pipe(
      tap(resp => {
        this.tokenStorage.setAccessToken(resp.accessToken);
        this.accessTokenSub.next(resp.accessToken);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.tokenStorage.clear();
        this.accessTokenSub.next(null);
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(resp => {
        this.tokenStorage.setAccessToken(resp.accessToken);
        this.accessTokenSub.next(resp.accessToken);
      }),
    );
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }
}
