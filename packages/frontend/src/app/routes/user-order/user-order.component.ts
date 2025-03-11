import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-order',
  imports: [CommonModule],
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.css',
})
export class UserOrderComponent {
  userId: string | undefined = '';
  orders: any;
  status = [
    { color: 'bg-green-500', text: 'Completed' },
    { color: 'bg-blue-500', text: 'Processing' },
    { color: 'bg-amber-500', text: 'Pending' },
    { color: 'bg-red-500', text: 'Cancelled' },
  ];
  constructor(
    private _OrdersService: OrdersService,
    private _AuthService: AuthService
  ) {
    this.userId = _AuthService.user?._id;
    this.getOrder(this.userId);
  }
  user: any;
  getOrder(id: string | undefined) {
    this._OrdersService.getUserOrder(id).subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getStatusClass(status: string): string {
    const statusObj = this.status.find((stat) => stat.text === status);
    return statusObj ? statusObj.color : 'bg-gray-500';
  }
}
