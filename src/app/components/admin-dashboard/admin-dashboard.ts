import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  _id?: string;
  name: string;
  companyEmail: string;
  password: string;
  role: 'HR' | 'Employee';
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  loading=false;

  showModal = false;
  editingUser: User | null = null;
  formData: User = { name: '', companyEmail: '', password:'', role: 'Employee' };

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page:number=this.currentPage) {
    this.loading=true;
    this.userService.getUsers(page, this.pageSize).subscribe({
      next: (res: any) => {
        this.users = res.users;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.currentPage = page;
        this.updatePaginatedUsers();
        this.loading = false;
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      }
    });
  }

  updatePaginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedUsers = this.users.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  openAddUserModal() {
    this.showModal = true;
    this.editingUser = null;
    this.formData = { name: '', companyEmail: '',password:'', role: 'Employee' };
  }

  openUpdateModal(user: User) {
    this.showModal = true;
    this.editingUser = user;
    this.formData = { ...user };
  }

  saveUser() {
    if (this.editingUser) {
      // Update user via API
      this.userService.updateUser(this.editingUser._id!, this.formData).subscribe({
        next: () => this.loadUsers(this.currentPage),
        error: (err) => console.error(err),
      });
    } else {
      // Add user via API
      this.userService.addUser(this.formData).subscribe({
        next: () => this.loadUsers(this.currentPage),
        error: (err) => console.error(err),
      });
    }
    this.closeModal();
  }

  removeUser(id?: string) {
    if (!id) return;
    if (confirm('Are you sure you want to remove this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(this.currentPage),
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

