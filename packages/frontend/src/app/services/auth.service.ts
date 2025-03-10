import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { UserLogin } from '../interfaces/user-login';
import { UserRegister } from '../interfaces/user-register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  login(user:UserLogin): Observable<User>{
    return this.http.post<User>(`${environment.base_url}/auth/login`,user);
  }
  register(user:UserRegister):Observable<User>{
    return this.http.post<User>(`${environment.base_url}/auth/register`,user);
  }
  me(): Observable<User>{
    return this.http.get<User>(`${environment.base_url}/auth/me`, { withCredentials: true });
  }
  logout(){
    return this.http.get(`${environment.base_url}/auth/logout`);
  }
}
