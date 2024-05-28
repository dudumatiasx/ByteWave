import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from './orders-list/orders.component';
import { NewOrderComponent } from './new-order/new-order.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: OrdersComponent },
    { path: 'new', component: NewOrderComponent, data: { title: 'New Order' }  },
    { path: 'edit/:id', component: NewOrderComponent, data: { title: 'Edit Order' } }
  ])],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
