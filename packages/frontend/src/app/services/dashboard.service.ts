import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {DashboardItem, DashboardResponse} from '../interfaces/dashboard.interface';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }
  getDashboardData(): Observable<DashboardItem[]>{
    return this.http.get<DashboardResponse>(`${environment.base_url}/dashboard`).pipe(map(res => res.data));
  }
}
