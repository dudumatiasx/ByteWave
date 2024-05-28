import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class InventoryComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  products!: Product[];
  product!: Product;
  selectedProducts!: Product[] | null;
  statuses!: any[];
  moreActions: MenuItem[] | undefined;
  activeFilter: string | null = 'all';
  clonedProducts: { [s: string]: Product; } = {};

  totalProducts: number = 0;
  inStockCount: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
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

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
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
        return 'warning';
    }
    return 'info';
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onRowEditInit(product: Product) {
    if (product.id !== undefined) {
      this.clonedProducts[product.id.toString()] = { ...product };
    }
  }

  editProduct(product: any) {
    this.router.navigate(['/products/edit', product.id]);
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:5200${imageUrl}`;
  }

  onRowEditSave(product: Product) {
    if (product.quantity !== undefined) {
      this.productService.updateProduct(product).subscribe(() => {
        if (product.id !== undefined) {
          delete this.clonedProducts[product.id.toString()];
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        this.loadProducts();
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Quantity' });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    if (product.id !== undefined) {
      this.products[index] = this.clonedProducts[product.id.toString()];
      delete this.clonedProducts[product.id.toString()];
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.calculateInventoryCounts();
    });
  }

  calculateInventoryCounts() {
    this.totalProducts = this.products.length;
    this.inStockCount = this.products.filter(p => p.quantity !== undefined && p.quantity > 10).length;
    this.lowStockCount = this.products.filter(p => p.quantity !== undefined && p.quantity > 0 && p.quantity <= 10).length;
    this.outOfStockCount = this.products.filter(p => p.quantity !== undefined && p.quantity === 0).length;
  }
}
