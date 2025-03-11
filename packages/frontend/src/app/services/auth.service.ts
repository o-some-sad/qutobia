import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { UserRegister } from '../interfaces/user-register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?:User;
  constructor(private http: HttpClient) {
    this.me().subscribe({
      next:(value)=>{
        this.user=value
      }
    })
   }
  login(user:User): Observable<User>{
    return this.
    http.post<User>(`${environment.base_url}/auth/login`,user);
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
