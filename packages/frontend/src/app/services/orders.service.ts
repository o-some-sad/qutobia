import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
   
  constructor(private _HttpClient:HttpClient) { }
  getOrders(): Observable<any> {
    return this._HttpClient.get(`${environment.base_url}/orders`);
  }
  updateOrder(updateBody:object,id:string):Observable<any>{
   
    return this._HttpClient.patch(`${environment.base_url}/orders/${id}`,updateBody)
  }
}
