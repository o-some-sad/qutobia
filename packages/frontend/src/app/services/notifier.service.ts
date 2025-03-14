import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {


  connect(){
    const ws = new WebSocket("/api/ws")
    ws.onerror = ws.onclose = ()=>{
      //reconnect
      setTimeout(() => {
        ws.onerror = ws.onclose = ws.onmessage = null
        this.connect()
      }, 3000);
    }
    ws.onmessage = (ev)=>{
      //in another case, we would get the type of the message and do action based on it, but in this case, we only have one type of event, which is new order addition
      toast.info("New order added", {
        action: {
          label: "see orders",
          onClick: ()=>location.replace("/dashboard/orders")
        }
      })
    }
  }
  

  constructor(authService: AuthService) {
      authService.me().subscribe(me=>{
        if(me.role === "admin"){
          this.connect()
        }
      })
  }
}
