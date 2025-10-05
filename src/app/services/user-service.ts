import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private baseUrl = environment.apiUrl; // or your deployed backend URL

  constructor(private http: HttpClient) {}

  getUsers(page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUsers?page=${page}&limit=${limit}`);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createUser`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateUser/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/removeUser/${id}`);
  }
}
