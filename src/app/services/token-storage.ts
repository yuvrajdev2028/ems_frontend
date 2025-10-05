import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clear() {
    this.accessToken = null;
  }
}
