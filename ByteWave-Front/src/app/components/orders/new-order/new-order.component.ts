import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/services/order.service';
import { CustomerService } from 'src/services/customer.service';
import { ProductService } from 'src/services/product.service';
import { AuthService } from 'src/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order, OrderProduct } from 'src/models/order.model';
import { Product } from 'src/models/product.model';
import { Customer } from 'src/models/customer.model';
import { Location } from '@angular/common';
import { UserService } from 'src/services/user.service';

type ProductWithQuantity = Product & { quantity: number };

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class NewOrderComponent implements OnInit {

  @Input() title = '';
  isEditMode: boolean = false;

  user: any = {
    id: '',
    userName: '',
    email: ''
  };

  order: Order = {
    id: 0,
    customerId: 0,
    sellerEmail: '',
    orderDate: new Date(),
    status: 'Pending',
    totalAmount: 0,
    customer: null,
    orderProducts: []
  };

  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  products: Product[] = [];
  selectedProducts: ProductWithQuantity[] = [];

  totalAmount: number = 0;

  sourceProducts: ProductWithQuantity[] = [];
  targetProducts: ProductWithQuantity[] = [];

  statuses: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' }
  ];
  selectedStatus: any | null = null;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUser(userId);
    }

    this.loadCustomers();
    this.loadProducts();

    this.title = this.route.snapshot.data['title'];
    this.isEditMode = this.title === 'Edit Order';
    if (this.isEditMode) {
      const orderId = this.route.snapshot.paramMap.get('id');
      if (orderId) {
        this.loadOrder(parseInt(orderId, 10));
      }
    }
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.user = user;
    });
  }

  loadOrder(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe((order: Order) => {
      this.order = order;
      this.selectedCustomer = this.customers.find(c => c.id === order.customerId) || null;
      this.selectedStatus = this.statuses.find(s => s.value === order.status);
      this.targetProducts = order.orderProducts.map((op: OrderProduct) => {
        const product = this.products.find(p => p.id === op.productId);
        if (product) {
          return { ...product, quantity: op.quantity };
        }
        return null;
      }).filter((p): p is ProductWithQuantity => p !== null); // Filter out null values
      this.sourceProducts = this.products.filter(p => !this.targetProducts.some(tp => tp.id === p.id)).map(p => ({ ...p, quantity: 1 }));
      this.calculateTotalAmount();
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((customers: Customer[]) => {
      this.customers = customers;
      if (this.isEditMode && this.order.customerId) {
        this.selectedCustomer = this.customers.find(c => c.id === this.order.customerId) || null;
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.sourceProducts = this.products.map(p => ({ ...p, quantity: 1 }));
      if (this.isEditMode && this.order.orderProducts) {
        this.targetProducts = this.order.orderProducts.map((op: OrderProduct) => {
          const product = this.products.find(p => p.id === op.productId);
          if (product) {
            return { ...product, quantity: op.quantity };
          }
          return null;
        }).filter((p): p is ProductWithQuantity => p !== null); // Filter out null values
        this.sourceProducts = this.products.filter(p => !this.targetProducts.some(tp => tp.id === p.id)).map(p => ({ ...p, quantity: 1 }));
      }
      this.calculateTotalAmount();
    });
  }

  onProductMoveToTarget(event: any) {
    event.items.forEach((product: ProductWithQuantity) => {
      product.quantity = 1; // Set default quantity to 1 when moved to target
    });
    this.calculateTotalAmount();
  }

  onProductMoveToSource(event: any) {
    this.calculateTotalAmount();
  }

  onProductQuantityChange() {
    this.calculateTotalAmount();
    console.log(this.totalAmount);
  }

  calculateTotalAmount() {
    this.totalAmount = this.targetProducts.reduce((total, product) => {
      return total + (product.price ?? 0) * (product.quantity ?? 1);
    }, 0);
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:5200${imageUrl}`;
  }

  saveOrder() {
    if (!this.selectedCustomer || !this.selectedStatus || this.targetProducts.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    this.order.customerId = this.selectedCustomer?.id ?? 0;
    this.order.status = this.selectedStatus.value;
    this.order.orderProducts = this.targetProducts.map(product => {
      return { productId: product.id ?? 0, quantity: product.quantity ?? 1 };
    });
    this.order.totalAmount = this.totalAmount;
    this.order.sellerEmail = this.user.email;

    console.log('Order to save:', this.order);

    if (this.isEditMode) {
      this.orderService.updateOrder(this.order).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Order Updated', detail: 'Order updated successfully' });
        this.router.navigate(['/orders']);
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    } else {
      this.orderService.createOrder(this.order).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Order Created', detail: 'Order created successfully' });
        this.router.navigate(['/orders']);
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    }
  }

  resetForm() {
    this.order = {
      id: 0,
      customerId: 0,
      sellerEmail: '',
      orderDate: new Date(),
      status: 'Pending',
      totalAmount: 0,
      customer: null,
      orderProducts: []
    };
    this.selectedCustomer = null;
    this.selectedStatus = null;
    this.selectedProducts = [];
    this.targetProducts = [];
    this.totalAmount = 0;
  }

  discard(event: Event) {
    if (this.isEditMode) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this order?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          if (this.order && this.order.id) {
            this.orderService.deleteOrder(this.order.id).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Order Deleted', detail: 'Order deleted successfully' });
              this.router.navigate(['/orders']);
            });
          }
        }
      });
    } else {
      this.router.navigate(['/orders']);
    }
  }

  backClicked() {
    this._location.back();
  }
}
