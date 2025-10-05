import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { AttendanceService } from '../../services/attendance-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
  imports: [FormsModule, CommonModule]
})
export class EmployeeDashboard implements OnInit {
  employee: any = {};
  formData: any = {};
  attendanceToday: string | null = null;
  showLeaveModal = false;
  leaveData = { from: '', to: '', reason: '' };
  loading = false;

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployeeDetails();
    this.loadAttendance();
  }

  loadEmployeeDetails() {
    this.loading = true;
    this.employeeService.getMyDetails().subscribe({
      next: (res:any) => {
        console.log(res)
        this.employee = res.employee;
        this.formData = {
          personalEmail: this.employee.personalEmail,
          contact: this.employee.contact
        };
        this.loading = false;
      },
      error: (err:any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateDetails() {
    this.employeeService.updateMyDetails(this.formData).subscribe({
      next: () => {
        alert('Details updated successfully!');
        this.loadEmployeeDetails();
      },
      error: (err:any) => console.error(err)
    });
  }

  markAttendance() {
    this.attendanceService.markAttendance().subscribe({
      next: () => {
        alert('Attendance marked!');
        this.loadAttendance();
      },
      error: (err:any) => console.error(err)
    });
  }

  loadAttendance() {
    this.attendanceService.getMyAttendance().subscribe({
      next: (res:any) => {
        this.attendanceToday = res.todayStatus || null;
      },
      error: (err:any) => console.error(err)
    });
  }

  openLeaveModal() {
    this.showLeaveModal = true;
    this.leaveData = { from: '', to: '', reason: '' };
  }

  applyLeave() {
    this.attendanceService.applyLeave(this.leaveData).subscribe({
      next: () => {
        alert('Leave applied successfully!');
        this.showLeaveModal = false;
      },
      error: (err:any) => console.error(err)
    });
  }

  closeLeaveModal() {
    this.showLeaveModal = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

