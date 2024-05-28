//! Aplication Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/users/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ProductsComponent } from './components/products/products-list/products.component';
import { InventoryComponent } from './components/products/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders-list/orders.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { CustomersComponent } from './components/customers/customers-list/customers.component';
import { RegisterComponent } from './components/users/register/register.component';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { UsersComponent } from './components/users/user-list/users.component';
import { NewOrderComponent } from './components/orders/new-order/new-order.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';

//! Aplication Services
import { CustomerService } from 'src/services/customer.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { AuthService } from 'src/services/auth.service';

//! Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//! PrimeNG Modules
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ImageModule } from 'primeng/image';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { PickListModule } from 'primeng/picklist';
import { AuthInterceptor } from 'src/services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavComponent,
    LoginComponent,
    NotfoundComponent,
    NewProductComponent,
    TitlebarComponent,
    ProductsComponent,
    InventoryComponent,
    OrdersComponent,
    ProfileComponent,
    CustomersComponent,
    UsersComponent,
    RegisterComponent,
    NewCustomerComponent,
    NewUserComponent,
    NewOrderComponent,
    CatalogComponent,
    OrderHistoryComponent
   ],
  imports: [
    //! Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //! PrimeNG Modules
    StyleClassModule,
    ButtonModule,
    ChartModule,
    DividerModule,
    MenuModule,
    MenubarModule,
    RippleModule,
    AvatarModule,
    AvatarGroupModule,
    ToastModule,
    CheckboxModule,
    PasswordModule,
    FieldsetModule,
    InputTextModule,
    InputMaskModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextareaModule,
    PanelModule,
    FileUploadModule,
    DropdownModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    SliderModule,
    MultiSelectModule,
    InputSwitchModule,
    ToolbarModule,
    MessagesModule,
    SplitButtonModule,
    ImageModule,
    DataViewModule,
    SelectButtonModule,
    CalendarModule,
    DialogModule,
    SidebarModule,
    PickListModule
  ],
  providers: [
    CustomerService,
    OrderService,
    ProductService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
