# ByteWave

ByteWave is a web application built with Angular 16 for the front-end and .NET 8 for the back-end. The application manages a product catalog, supports order processing, and provides role-based access control for users including Admins, Sellers, and Customers.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [TestUsers](#precreated-users)
- [Usage](#usage)
- [Roles and Permissions](#roles-and-permissions)
- [Endpoints](#endpoints)
- [Development](#development)
- [License](#license)

## Features

- **User Authentication**: Registration and login functionalities.
- **Role-Based Access Control**: Admins, Sellers, and Customers have different access levels.
- **Product Management**: Admins and Sellers can add, update, and delete products.
- **Order Management**: Admins and Sellers can create, update, and delete orders, and customers can view their orders.
- **Customer Management**: Admins and Sellers can add, update, and delete customers.
- **User Management**: Admins can add, update, and delete users.
- **Dashboard**: Overview of sales, customers, inventory and orders with charts.

## Technologies Used

- **Front-End**:
  - Angular 16
  - PrimeNG
  - PrimeFlex
  - Lucid Icons
  - Charts.js

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

   `git clone <https://github.com/dudumatiasx/ByteWave>`

2. Navigate to the front-end directory:

   `cd ByteWave/ByteWave-Front`

3. Install dependencies:

   `npm install`

4. Start the Angular application:

   `ng serve`

### Back-End Setup

5. Navigate to the back-end directory:

   `cd ByteWave/ByteWave-Back`

   `dotnet restore`

6. Run the .NET application:

   `cd .\Bytewave.Api\`  
   
   `dotnet run`


### Running the Application
  
  - Open your browser and navigate to [front-end](http://localhost:4200) `http://localhost:4200`.
  - The API will be available at [back-end](https://localhost:5200/swagger/index.html) `https://localhost:5200/swagger/index.html`.

### Precreated Users

  **Admin User**
  - User: admin
  - Password: Admin@123

  **Seller User**
  - User: seller
  - Password: Seller@123

  **Customer User**
  - User: bobjohnson
  - Password: Customer@123

### Usage

  **Registration**
  - Go to the registration page and create an account. This page creates a Customer user.
  - To create an Admin or Seller, you will need to log in with an admin user and create a user on the users page.

  **Login**
  - Use the credentials to log in. The dashboard and functionalities will change based on the role of the logged-in user.
  
  **Dashboard**
  - The dashboard provides an overview of sales and orders with dynamic charts and data updates.
  - Admins can see all data, while Sellers can see data based on their orders. Customers do not have access to the dashboard.
  
  **Creating and Viewing Orders**
  - Admins and Sellers can create new orders for customers.
  - Sellers and Customers can only view their own orders.

  **Managing Products**
  - Admins and Sellers can add, edit, and delete products through the product management interface.

  **Managing Customers**
  - Admins and Sellers can add, edit, and delete customers through the customer management interface.

  **Managing User**
  - Admins can add, edit, and delete users through the user management interface.
  - The default password for a new user created by the Admin is: 'Default@123'.
  - After the first login, the user can change the password on the Profile Page.

  **Profile**
  - The profile can be found by clicking on the username on the menubar.
  - Users can change their username, email, and password.

### Roles and Permissions**
  Admin: Full access to manage users, products, and orders.
  Seller: Can create and manage their own orders, customers, and products.
  Customer: Can view the product catalog and their own orders.

### Endpoints

  **User Authentication**
  - [POST](/api/auth/register): Register a new user.
  - [POST](/api/auth/login): Authenticate a user and return a JWT token.

  **Products**
  - [GET](/api/products): Get all products.
  - [POST](/api/products): Create a new product.
  - [PUT](/api/products/{id}): Update a product.
  - [DELETE](/api/products/{id}): Delete a product.

  **Orders**
  - [GET](/api/orders): Get all orders or filtered orders based on role.
  - [POST](/api/orders): Create a new order.
  - [PUT](/api/orders/{id}): Update an order.
  - [DELETE](/api/orders/{id}): Delete an order.

  **Customers**
  - [GET](/api/orders): Get all customers or filtered customers.
  - [POST](/api/orders): Create a new customer.
  - [PUT](/api/orders/{id}): Update an customer.
  - [DELETE](/api/orders/{id}): Delete an customer.

  **Users**
  - [GET](/api/orders): Get all users or filtered users.
  - [POST](/api/orders): Create a new user.
  - [PUT](/api/orders/{id}): Update an user.
  - [DELETE](/api/orders/{id}): Delete an user.

### Development

  **Auth Service**
  - Handles user authentication and token management.

  **User Service**
  - Fetches user details from the API.
  
  **Order Service**
  - Manages order creation, updates, and retrieval from the API.
  
  **Product Service**
  - Handles CRUD operations for products.
  
  **Customer Service**
  - Manages customer data 

