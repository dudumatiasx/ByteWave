import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers-list/customers.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: CustomersComponent },
    { path: 'new', component: NewCustomerComponent, data: { title: 'Add Customer' } },
    { path: 'edit/:id', component: NewCustomerComponent, data: { title: 'Edit Customer' } }
  ])],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
