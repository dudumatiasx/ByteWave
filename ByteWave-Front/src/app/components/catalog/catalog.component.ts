import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  providers: [ProductService]
})
export class CatalogComponent implements OnInit {

  products: Product[] = [];
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  categories: string[] = [];
  categoryOptions: SelectItem[] = [];
  selectedCategories: string[] = [];
  inventoryStatusOptions: SelectItem[] = [];
  selectedInventoryStatus: string[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();

    this.sortOptions = [
      { label: 'A-Z', value: 'title' },
      { label: 'Z-A', value: '!title' },
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];

    this.inventoryStatusOptions = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' }
    ];
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:5200${imageUrl}`;
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.initializeCategories();
    });
  }

  initializeCategories() {
    const categorySet = new Set(this.products.map(product => product.category));
    this.categoryOptions = Array.from(categorySet).map(category => ({ label: category, value: category }));
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onCategoryChange(event: any) {
    this.filterProducts();
  }

  onInventoryStatusChange(event: any) {
    this.filterProducts();
  }

  filterProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      if (this.selectedCategories.length === 0 && this.selectedInventoryStatus.length === 0) {
        this.products = data;
      } else {
        this.products = data.filter((product: Product) =>
          (this.selectedCategories.length === 0 || (product.category && this.selectedCategories.includes(product.category)))
          && (this.selectedInventoryStatus.length === 0 || (product.quantity !== undefined && this.selectedInventoryStatus.includes(this.getInventoryStatus(product))))
        );
      }
    });
  }

  onFilter(dv: any, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
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
    }
    return 'info';
  }
}
