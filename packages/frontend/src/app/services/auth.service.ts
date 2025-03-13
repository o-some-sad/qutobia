import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { UserRegister } from '../interfaces/user-register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId:string='';
  user?:User;
  constructor(private http: HttpClient) {
    this.me().subscribe({
      next:(value)=>{
        this.userId=value._id;
        this.user=value;
      }
    })
   }
  login(user:User): Observable<{user:User,token:string}>{
    return this.
    http.post<{user:User,token:string}>(`${environment.base_url}/auth/login`,user);
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

  userRole(): Observable<string|null>{
    if(this.user) return of<string>(this.user.role);
    else {
      console.log("from auth service");
      return this.me().pipe(map(user=> user.role), catchError(() => of(null)));
    }
  }
}
