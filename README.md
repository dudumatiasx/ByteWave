# ByteWave

ByteWave is a web application built with Angular 16 for the front-end and .NET 8 for the back-end. The application manages a product catalog, supports order processing, and provides role-based access control for users including Admins, Sellers, and Customers.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Roles and Permissions](#roles-and-permissions)
- [Endpoints](#endpoints)
- [Development](#development)
- [License](#license)

## Features

- **User Authentication**: Registration and login functionalities.
- **Role-Based Access Control**: Admins, Sellers, and Customers have different access levels.
- **Product Management**: Admins can add, update, and delete products.
- **Order Management**: Sellers can create orders, and customers can view their orders.
- **Dashboard**: Overview of sales and orders with charts.

## Technologies Used

- **Front-End**:
  - Angular 16
  - PrimeNG
  - PrimeFlex
- **Back-End**:
  - .NET 8
  - Entity Framework Core
  - ASP.NET Core Identity
  - JWT Authentication
- **Database**:
  - In-Memory Database (for development and testing)

## Setup and Installation

### Prerequisites

- **Node.js (v14 or later)**:
  - Download and install from [Node.js official website](https://nodejs.org/).

- **Angular CLI**:
  - Install Angular CLI globally:

    `npm install -g @angular/cli@16`

- **.NET 8 SDK**:
  - Download and install from [.NET 8 official website](https://dotnet.microsoft.com/download/dotnet/8.0).

- **Git**:
  - Download and install from [Git official website](https://git-scm.com/).

### Front-End Setup

1. Clone the repository:

   `git clone` <repository-url>

2. Navigate to the front-end directory:

   `cd ByteWave/ByteWave-Front`

3. Install dependencies:

   `npm install`

4. Start the Angular application:

   `ng serve`

## Back-End Setup

5. Navigate to the back-end directory:

   `cd ../ByteWave-Back`
   `dotnet restore`

6. Run the .NET application:

   `dotnet run`


### Running the Application
  
  - Open your browser and navigate to [front-end](http://localhost:4200).
  - The API will be available at [back-end](https://localhost:5200/swagger/index.html).

### Usage

  **Registration**
  - Go to the registration page and create an account. You can register as an Admin, Seller, or Customer.

  **Login**
  - Use the credentials to log in. The dashboard and functionalities will change based on the role of the logged-in user.
  
  **Managing Products**
  - Admins can add, edit, and delete products through the product management interface.

  **Creating and Viewing Orders**
  - Sellers can create new orders for customers. Customers can view their orders.

  **Dashboard**
  The dashboard provides an overview of sales and orders with dynamic charts and data updates.

### Roles and Permissions**
  Admin: Full access to manage users, products, and orders.
  Seller: Can create and manage their own orders and view their products.
  Customer: Can view their orders.

### Endpoints

  **User Authentication**
  [POST](/api/auth/register): Register a new user.
  [POST](/api/auth/login): Authenticate a user and return a JWT token.

  **Products**
  [GET](/api/products): Get all products.
  [POST](/api/products): Create a new product (Admin only).
  [PUT](/api/products/{id}): Update a product (Admin only).
  [DELETE](/api/products/{id}): Delete a product (Admin only).

  **Orders**
  [GET](/api/orders): Get all orders (Admin) or filtered orders based on role.
  [POST](/api/orders): Create a new order (Seller).
  [PUT](/api/orders/{id}): Update an order (Seller/Admin).
  [DELETE](/api/orders/{id}): Delete an order (Admin).

### Development

  **Auth Service**
  Handles user authentication and token management.

  **User Service**
  Fetches user details from the API.
  
  **Order Service**
  Manages order creation, updates, and retrieval from the API.
  
  **Product Service**
  Handles CRUD operations for products.
  
  **Customer Service**
  Manages customer data 

