import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CustomerService } from 'src/services/customer.service';
import { Router } from '@angular/router';
import { Customer } from 'src/models/customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CustomersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  customers: Customer[] = [];
  selectedCustomers!: Customer[] | null;
  activeFilter: string | null = 'all';

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      (data: Customer[]) => {
        this.customers = data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customers' });
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  editCustomer(customer: any) {
    this.router.navigate(['/customers/edit', customer.id]);
  }
}
