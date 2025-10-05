import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.apiUrl; // Update to your backend URL if deployed

  constructor(private http: HttpClient) {}

  getEmployees(page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEmployees?page=${page}&limit=${limit}`);
  }

  getMyDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getMyDetails`);
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createEmployee`, employeeData);
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateEmployee/${id}`, employeeData);
  }

  updateMyDetails(employeeData: any):Observable<any> {
    return this.http.put(`${this.baseUrl}/updateMyDetails`,employeeData);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/removeEmployee/${id}`);
  }

  getUnlinkedEmployeeUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/unlinkedUsers`);
  }
}
