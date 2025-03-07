import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { UserLogin } from '../interfaces/user-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  login(user:UserLogin): Observable<User>{
    return this.
    http.post<User>(`${environment.base_url}/auth/login`,user);
  }
  me(): Observable<User>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return this.http.get<User>(`${environment.base_url}/auth/me`, { headers });
  }
}
