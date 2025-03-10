import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface OrderBook {
  book: {
    _id: string;
    title: string;
    author: string;
    format: string;
    coverImage: string;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  user: string;
  books: OrderBook[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
  };
}

@Component({
  selector: 'app-user-order',
  imports: [CommonModule],
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.css'
})
export class UserOrderComponent {


  order: Order = {
    _id: 'ORD-2023-4829',
    user: 'USER-1234',
    books: [
      {
        book: {
          _id: 'BK-001',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          format: 'Paperback',
          coverImage: 'https://via.placeholder.com/80x100'
        },
        quantity: 1,
        price: 12.99,
        _id: 'ITEM-001'
      },
      {
        book: {
          _id: 'BK-002',
          title: '1984',
          author: 'George Orwell',
          format: 'Hardcover',
          coverImage: 'https://via.placeholder.com/80x100'
        },
        quantity: 2,
        price: 11.99,
        _id: 'ITEM-002'
      }
    ],
    totalPrice: 36.97,
    status: 'shipped',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-18'),
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zip: '10001',
      phone: '(555) 123-4567'
    }
  };

  formatId(id: string): string {
    return id.split('-').join(' ').toUpperCase();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-blue-600';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  trackOrder() {
    // Implement track order logic
  }

  downloadInvoice() {
    // Implement download invoice logic
  }
}