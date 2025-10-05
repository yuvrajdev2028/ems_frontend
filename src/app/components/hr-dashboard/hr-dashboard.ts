import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { EmployeeService } from '../../services/employee-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../services/department-service';

interface Employee {
  _id?: string;
  personalEmail: string;
  department?: Department | null;
  joining_date: string;
  contact: number;
  user?: User | null;
}

interface Department {
  _id?: string;
  name: string;
}

interface User {
  _id?: string;
  name: string;
  companyEmail: string;
  role?: string;
}

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css'
})
export class HrDashboard implements OnInit {
  employees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  loading = false;
  departments: Department[] =[]
  unlinkedUsers: User[]=[]

  showModal = false;
  editingEmployee: Employee | null = null;
  formData: Employee = {
    personalEmail: '',
    department: null,
    joining_date: '',
    contact: 0,
    user: null
  };

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next:(res:any) => {
        this.departments=res.departments;
      },
      error:(err)=>{
        console.log(err);
      }
    });
    this.loadUnlinkedUsers();
    this.loadEmployees();
  }

  loadUnlinkedUsers() {
    this.employeeService.getUnlinkedEmployeeUsers().subscribe({
      next: (res) => {
        this.unlinkedUsers = res.unlinkedUsers || [];
      },
      error: (err) => console.error(err)
    });
  }

  loadEmployees(page: number = this.currentPage) {
    this.loading = true;
    this.employeeService.getEmployees(page, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        this.employees = res.employees;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.currentPage = page;
        this.updatePaginatedEmployees();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  updatePaginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedEmployees = this.employees.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadEmployees(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadEmployees(this.currentPage - 1);
    }
  }

  openAddEmployeeModal(user: any) {
    this.showModal = true;
    this.editingEmployee = null;
    this.formData = {
      personalEmail: user.companyEmail,
      user: user._id,
      contact: 0,
      joining_date: '',
      department: null
    };
  }

  openUpdateModal(employee: Employee) {
    this.showModal = true;
    this.editingEmployee = employee;
    this.formData = { ...employee };
  }

  saveEmployee() {
    if (this.editingEmployee) {
      // Update employee
      this.employeeService.updateEmployee(this.editingEmployee._id!, this.formData).subscribe({
        next: () => this.loadEmployees(this.currentPage),
        error: (err) => console.error(err),
      });
    } else {
      // Add employee
      this.employeeService.addEmployee(this.formData).subscribe({
        next: () => {
          this.loadUnlinkedUsers();
          this.loadEmployees(this.currentPage)
        },
        error: (err) => console.error(err),
      });
    }
    this.closeModal();
  }

  removeEmployee(id?: string) {
    if (!id) return;
    if (confirm('Are you sure you want to remove this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () =>{
          console.log("here")
          this.loadEmployees(this.currentPage)
        },
        error: (err) => console.error(err),
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
