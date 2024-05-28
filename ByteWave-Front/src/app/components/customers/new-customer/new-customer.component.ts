import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/services/customer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/models/customer.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class NewCustomerComponent implements OnInit {

  @Input() title = '';
  isEditMode: boolean = false;

  customer: Customer = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    postalCode: '',
    state: '',
    street: ''
  };

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
    this.isEditMode = this.title === 'Edit Customer';
    if (this.isEditMode) {
      const customerId = this.route.snapshot.paramMap.get('id');
      if (customerId) {
        this.loadCustomer(parseInt(customerId,10));
      }
    }
  }

  loadCustomer(customerId: number) {
    this.customerService.getCustomerById(customerId).subscribe((customer: any) => {
      this.customer = customer;
    });
  }

  saveCustomer() {
    if (!this.customer.name || !this.customer.email) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customer).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Customer Updated', detail: 'Customer updated successfully' });
        this.router.navigate(['/customers']);
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    } else {
      this.customerService.createCustomer(this.customer).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Customer Created', detail: 'Customer created successfully' });
        this.router.navigate(['/customers']);
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    }
  }

  resetForm() {
    this.customer = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      postalCode: '',
      state: '',
      street: ''
    };
  }

  discard(event: Event) {
    if (this.isEditMode) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this customer?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          if (this.customer && this.customer.id) {
            this.customerService.deleteCustomer(this.customer.id).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Customer Deleted', detail: 'Customer deleted successfully' });
              this.router.navigate(['/customers']);
            });
          }
        }
      });
    } else {
      this.router.navigate(['/customers']);
    }
  }

  backClicked() {
    this._location.back();
  }
}
