import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _HttpClient:HttpClient) { }
  getOrders(): Observable<any> {
    return this._HttpClient.get('http://localhost:3000/api/orders',{
      headers:new HttpHeaders({
        'Authorization':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3Y2I3NmEwNzM1NzViZmVlNjZlZDkzYyIsIm5hbWUiOiJBaG1lZDIyIiwiZW1haWwiOiJhaG1lZHJhbWEyMkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpbWFnZSI6bnVsbH0sImlhdCI6MTc0MTUzMTMzNCwiZXhwIjoxNzQxNTM0OTM0fQ.GSHasQMqFiOHEmF9h9bv9DNRu7vd40QPyVRN-MW5__g"
      })
    });
  }
}
