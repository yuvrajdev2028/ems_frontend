import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = environment.apiUrl; // Update to your backend URL if deployed

  constructor(private http: HttpClient) {}
  markAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/markAttendance`);
  }

  applyLeave(data: { from: string; to: string; reason: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/leave/apply`, data);
  }

  getMyAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/attendance/my`);
  }
}
