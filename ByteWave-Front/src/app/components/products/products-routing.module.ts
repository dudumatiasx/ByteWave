import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductsComponent } from './products-list/products.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ProductsComponent },
    { path: 'new', component: NewProductComponent, data: { title: 'Add Product' } },
    { path: 'edit/:id', component: NewProductComponent, data: { title: 'Edit Product' } }
  ])],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
