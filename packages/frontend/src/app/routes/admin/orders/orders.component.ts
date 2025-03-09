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
  searchedValue: string = '';
  editOrderId: string | null = null;
  editValue: string = '';
  constructor(private _OrdersService:OrdersService){
   
    
  }
  ngOnInit() {
    this._OrdersService.getOrders().subscribe({
      next:(data)=>{this.ordersData=data.order;
      },
      error:(err)=>console.error(err)
    })
  
    
  }
  getFilteredOrders() {
    return this.ordersData.filter((order: any) => 
      order.user.name.toLowerCase().startsWith(this.searchedValue.toLowerCase())
    );
  }
  editOrder(orderId: string, currentStatus: string) {
    this.editOrderId = orderId;
    this.editValue = currentStatus;
  }
  updateOrder() {
    console.log(this.editValue);
    this._OrdersService.updateOrder({status:this.editValue}).subscribe({
      next:(res)=>{
        console.log(res);
        this._OrdersService.getOrders().subscribe({
          next:(data)=>{this.ordersData=data.order;
          },
          error:(err)=>console.error(err)
        })
      }
    })
    this.editOrderId = null;
    console.log("edit");
  }

  getStatusClass(status: string): string {
    const statusObj = this.status.find(stat => stat.text === status);
    return statusObj ? statusObj.color : 'bg-gray-500';
  }

}
