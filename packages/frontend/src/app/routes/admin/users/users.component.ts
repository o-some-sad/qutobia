import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../../interfaces/user.interface';
import {UserService} from '../../../services/user.service';
import {FormsModule} from '@angular/forms';
import {CommonModule, NgClass} from '@angular/common';
import { toast } from 'ngx-sonner';
import {SearchComponent} from '../../../components/search/search.component';
import {RadioButtonComponent} from '../../../components/radio-button/radio-button.component';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {SharedService} from '../../../services/shared.service';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    NgClass,
    SearchComponent,
    RadioButtonComponent,
    PaginationComponent,
    CommonModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  data: User[];
  currPage: number = 1;
  totalPages: number = 1;
  searchValue: string = '';
  selectedRole: string = 'all';

  constructor(private userService: UserService, private headerService: HeaderService) {
    this.data = [];
  }
  ngOnInit(): void {
    this.loadUsers(this.currPage);
  }

  @ViewChild('headerPortal') portal!: TemplateRef<any>;
  ngAfterViewInit(): void {
    this.headerService.setPortal(this.portal)
  }
  ngOnDestroy(): void {
    this.headerService.setPortal(null)
  }

  goToPage(page: number) {
    this.currPage = page;
    this.loadUsers(page);
  }
  onValueChange(role: string) {
    this.selectedRole = role;
    this.loadUsers(1);
  }
  onSearchChange(searchValue: string): void {
    this.searchValue = searchValue.trim();
    this.loadUsers(1);
  }
  changeRole(user: User) {
    const originalRole = user.role;
    user.role = user.role === 'user' ? 'admin' : 'user';
    const toast_id = toast.loading('Updating role...');
    this.userService.updateUser(user).subscribe({
      next: (_) => {
        toast.success('Role updated successfully', { id: toast_id });
        this.data.find(u => u._id === user._id)!['role'] = user.role;
        this.loadUsers(this.currPage);
      },
      error: (_) => {
        user.role = originalRole;
        toast.error('Failed to update role', { id: toast_id });
      }
    });
  }
  loadUsers(page: number) {
    this.userService.getUsers(page, this.selectedRole, this.searchValue).subscribe(res => {
      this.data = res.users;
      this.totalPages = res.totalPages;
    });
  }
}
