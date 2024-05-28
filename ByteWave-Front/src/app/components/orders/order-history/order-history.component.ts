import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { OrderService } from 'src/services/order.service';
import { Router } from '@angular/router';
import { Order } from 'src/models/order.model';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  user: any = {
    id: '',
    userName: '',
    email: ''
  };

  orders!: Order[];
  order!: Order;
  selectedOrders!: Order[] | null;
  statuses!: any[];
  moreActions: MenuItem[] | undefined;
  activeFilter: string | null = 'all';
  userRole: string | null = '';
  filteredOrders: Order[] = [];
  userEmail: string | null = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService // Inject the UserService
  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUser(userId);
    }

    this.userRole = this.authService.getUserRole();
    this.loadOrders();

    this.statuses = [
      { label: 'PENDING', value: 'PENDING' },
      { label: 'SHIPPED', value: 'SHIPPED' },
      { label: 'DELIVERED', value: 'DELIVERED' }
    ];
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.user = user;
      this.userEmail = user.email;
      this.applyFilters();
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    if (this.userRole === 'Admin') {
      this.filteredOrders = this.orders;
    } else if (this.userRole === 'Seller') {
      this.filteredOrders = this.orders.filter(order => order.sellerEmail === this.userEmail);
    } else if (this.userRole === 'Customer') {
      this.filteredOrders = this.orders.filter(order => order.customer?.email === this.userEmail);
    }
  }

  applyFilterStatus(filterType: string) {
    if (this.dt) {
      this.dt.reset();
      this.dt.filter(filterType.toUpperCase(), 'status', 'equals');
      this.activeFilter = filterType;
    }
  }

  filterAll() {
    if (this.dt) {
      this.dt.reset();
      this.activeFilter = 'all';
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'SHIPPED':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'DELIVERED':
        return 'success';
    }
    return 'info';
  }

  editOrder(order: any) {
    this.router.navigate(['/orders/edit', order.id]);
  }
}
