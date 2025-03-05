import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {User, UsersResponse} from '../interfaces/user.interface';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  getUsers(page: number, role: string, search: string): Observable<{ users: User[], totalPages: number }> {
    let url = `${environment.base_url}/users?page=${page}`;
    if (role !== 'all') url += `&role=${role}`;
    if (search) url += `&name=${search}`;
    return this.http.get<UsersResponse>(url).pipe(
      map(res => ({
        users: res.data,
        totalPages: res.totalPages
      }))
    );
  }
  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.base_url}/users/${user._id}`, user);
  }
}
