import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { AdminDashboard } from '../../components/admin-dashboard/admin-dashboard';
import { HrDashboard } from '../../components/hr-dashboard/hr-dashboard';
import { EmployeeDashboard } from '../../components/employee-dashboard/employee-dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  imports: [AdminDashboard, HrDashboard, EmployeeDashboard, CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {
   role!: string | null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.role = this.auth.getUserRole();
  }
}
