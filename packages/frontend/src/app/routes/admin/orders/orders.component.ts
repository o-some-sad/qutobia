import { Order } from './../../../interfaces/order';
import { Component } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  status = [
    { color: "bg-green-500", text: "Completed" },
    { color: "bg-blue-500", text: "Processing" },
    { color: "bg-amber-500", text: "Pending" },
    { color: "bg-red-500", text: "Cancelled" },
  ];
  ordersData: any;
  serachedValue:string='';
  edit:boolean=false;
  editVale:string=''
  constructor(private _OrdersService:OrdersService){
   
    
  }
  ngOnInit() {
    this._OrdersService.getOrders().subscribe({
      next:(data)=>{this.ordersData=data.order
      },
      error:(err)=>console.error(err)
    })
  
    
  }
  getFilteredOrders() {
    return this.ordersData.filter((order:any) => order.user.name.toLowerCase().startsWith(this.serachedValue));
  }
  editOrder(){
    this.edit=true;
    
  }
  updateOrder(){
    console.log(this.editVale);
    this.edit=false;
    console.log("edit");
    
  }

}
