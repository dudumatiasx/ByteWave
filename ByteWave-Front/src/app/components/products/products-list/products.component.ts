import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProductsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  products!: Product[];
  product!: Product;
  selectedProducts!: Product[] | null;
  statuses!: any[];
  moreActions: MenuItem[] | undefined;
  activeFilter: string | null = 'all';

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadProducts();

    this.statuses = [
      { label: 'INSTOCK', value: 'INSTOCK' },
      { label: 'LOWSTOCK', value: 'LOWSTOCK' },
      { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
    ];
  }

  applyFilterQuantityZero() {
    if (this.dt) {
      this.dt.clear();
      this.dt.filter(0, 'quantity', 'equals');
      this.activeFilter = 'quantityZero';
    }
  }

  applyFilterQuantityLow() {
    if (this.dt) {
      this.dt.clear();
      this.dt.filter(10, 'quantity', 'lte');
      this.activeFilter = 'quantityLow';
    }
  }

  applyFilterQuantityHigh() {
    if (this.dt) {
      this.dt.clear();
      this.dt.filter(10, 'quantity', 'gt');
      this.activeFilter = 'quantityHigh';
    }
  }

  applyFilterStatus(filterType: string) {
    if (this.dt) {
      this.dt.clear();
      this.dt.filter(filterType.toUpperCase(), 'status', 'equals');
      this.activeFilter = filterType;
    }
  }

  filterAll() {
    if (this.dt) {
      this.dt.clear();
      this.activeFilter = 'all';
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  getInventoryStatus(product: Product): string {
    if (product.quantity !== undefined) {
      if (product.quantity > 10) {
        return 'INSTOCK';
      } else if (product.quantity > 0 && product.quantity <= 10) {
        return 'LOWSTOCK';
      } else if (product.quantity === 0) {
        return 'OUTOFSTOCK';
      }
    }
    return 'UNKNOWN';
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      case 'Active':
        return 'info';
      case 'Inactive':
        return 'danger';
    }
    return 'info';
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:5200${imageUrl}`;
  }

  editProduct(product: any) {
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(productId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.productService.deleteProduct(productId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Product Deleted', detail: 'Product deleted successfully' });
          this.loadProducts();
        });
      }
    });
  }
}
