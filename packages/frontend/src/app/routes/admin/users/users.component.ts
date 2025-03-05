import {Component, OnInit} from '@angular/core';
import {User} from '../../../interfaces/user.interface';
import {UserService} from '../../../services/user.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {ToastService} from '../../../services/toast.service';
import {SearchService} from '../../../services/search.service';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  data: User[];
  currPage: number = 1;
  totalPages: number = 1;
  searchValue: string = '';
  selectedRole: string = 'all';
  loadingMap: { [key: string]: boolean } = {};

  constructor(private userService: UserService, private toastService: ToastService, private searchService: SearchService) {
    this.data = [];
  }
  ngOnInit(): void {
    this.loadUsers(this.currPage);
    this.searchService.searchValue$.subscribe(value => {
      this.searchValue = value.trim();
      this.userService.getUsers(1, this.selectedRole, this.searchValue).subscribe(res => {
        this.data = res.users;
        this.totalPages = res.totalPages;
      });
    });
  }
  goToPage(page: number) {
    this.currPage = page;
    this.loadUsers(page);
  }
  loadUsers(page: number) {
    this.userService.getUsers(page, this.selectedRole, this.searchValue).subscribe(res => {
      this.data = res.users;
      this.totalPages = res.totalPages;
    });
  }
  changeRole(user: User) {
    const originalRole = user.role;
    this.loadingMap[user._id] = true;
    user.role = user.role === 'user' ? 'admin' : 'user';
    this.userService.updateUser(user).subscribe({
      next: (res) => {
        this.loadingMap[user._id] = false;
        this.toastService.showToast('Role updated successfully', 'success');
        this.loadUsers(this.currPage);
      },
      error: (err) => {
        this.loadingMap[user._id] = false;
        user.role = originalRole;
        this.toastService.showToast('Failed to update role', 'error');
      }
    });
  }
  onRoleChange() {
    this.userService.getUsers(1, this.selectedRole, this.searchValue).subscribe(res => {
      this.data = res.users;
      this.totalPages = res.totalPages;
    });
  }
}
