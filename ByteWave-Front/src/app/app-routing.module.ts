import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/users/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { InventoryComponent } from './components/products/inventory/inventory.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { RegisterComponent } from './components/users/register/register.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AuthGuard } from 'src/services/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller'] } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Customer'] } },
  { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller', 'Customer'] } },
  { path: 'orders', loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller'] } },
  { path: 'users', loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'products', loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule), canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller'] } },
  { path: 'customers', loadChildren: () => import('./components/customers/customers.module').then(m => m.CustomersModule), canActivate: [AuthGuard], data: { roles: ['Admin', 'Seller'] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
