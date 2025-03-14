# Qutobia - Online Bookstore System

## Overview

Qutobia is an **online bookstore system** built using the **MEAN** stack **Node.js, Express, MongoDB, and Angular**. It allows users to browse books, add them to their cart, place orders, and receive real-time updates on order status and notifications.

## Features

- **User authentication & role-based access control** (Admin & User)
- **Real-time order notifications** using WebSockets
- **Book browsing, searching, and filtering**
- **Shopping cart and checkout system**
- **Order history tracking**
- **Tailwind CSS & DaisyUI for modern UI design**
- Integrate a payment gateway for seamless transactions using **Stripe**.

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, WebSocket (`ws`)
- **Frontend:** Angular, Tailwind CSS, DaisyUI
- **Database:** MongoDB (for book, user, and order data storage)

## Usage

### Running the Online Bookstore

- The system allows users to **browse books**, **add them to the cart**, and **place orders**.
- **Admins** can manage books (CRUD operations) and track orders.
- **Customers** can buy books and add reviews and edit them.

### WebSocket Integration

- WebSockets are used so that admins are alerted with **real-time notifications whenever a new order is placed.** 

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.


# Development instructions
> [!IMPORTANT]  
> Please read this section carefully

1. run this command to ensure running pre-commit hooks
```sh
git config --local core.hooksPath .githooks/
```
2. install required packages  
_if you don't have pnpm installed on your system please follow [this guide](https://pnpm.io/installation)_
```sh
pnpm install
```
3. run both backend and frontend server
```sh
# back
cd packages/backend
pnpm start
```

```sh
# front
cd packages/frontend
pnpm start
```
