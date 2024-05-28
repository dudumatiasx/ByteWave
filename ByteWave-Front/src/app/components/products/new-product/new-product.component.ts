import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/services/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class NewProductComponent implements OnInit {

  @Input() title = '';
  isEditMode: boolean = false;
  status: any[] = [];
  selectedStatus: any | null = null;
  category: any[] = [];
  selectedCategory: any | null = null;
  selectedFile: File | null = null;

  product: Product = {
    id: 0,
    title: '',
    description: '',
    price: undefined,
    quantity: undefined,
    status: '',
    category: '',
    code: '',
    imageUrl: '',
  };

  statuses: any[] = [
    { label: 'In Stock', value: 'INSTOCK' },
    { label: 'Low Stock', value: 'LOWSTOCK' },
    { label: 'Out of Stock', value: 'OUTOFSTOCK' }
  ];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
    this.isEditMode = this.title === 'Edit Product';
    if (this.isEditMode) {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.loadProduct(parseInt(productId, 10));
      }
    }

    this.status = [
      { name: 'Active', code: 'Active' },
      { name: 'Inactive', code: 'Inactive' }
    ];

    this.selectedStatus = this.status.find(s => s.name === 'Active');

    this.category = [
      { name: 'GPU', code: 'GPU' },
      { name: 'Processor', code: 'Processor' },
      { name: 'Headset', code: 'Headset' },
      { name: 'Monitor', code: 'Monitor' },
      { name: 'Motherboard', code: 'Motherboard' },
      { name: 'Mouse', code: 'Mouse' },
      { name: 'Memory', code: 'Memory' },
    ];
  }

  loadProduct(productId: number) { // Alterado para number
    this.productService.getProductById(productId).subscribe((product: any) => {
      this.product = product;
      this.selectedStatus = this.status.find(s => s.code === product.status);
      this.selectedCategory = this.category.find(c => c.code === product.category);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0];
  }

  saveProduct() {
    if (!this.product.title || !this.product.price || !this.product.code || !this.selectedStatus || !this.selectedCategory) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    this.product.status = this.selectedStatus ? this.selectedStatus.code : '';
    this.product.category = this.selectedCategory ? this.selectedCategory.code : '';

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct() {
    this.productService.createProduct(this.product).subscribe((createdProduct: Product) => {
      if (this.selectedFile && createdProduct.id) {
        this.uploadImage(createdProduct.id);
      } else {
        this.onSuccess('Product Created', 'Product created successfully');
      }
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  updateProduct() {
    this.productService.updateProduct(this.product).subscribe(() => {
      if (this.selectedFile && this.product.id) {
        this.uploadImage(this.product.id);
      } else {
        this.onSuccess('Product Updated', 'Product updated successfully');
      }
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  uploadImage(productId: number) {
    if (this.selectedFile) {
      this.productService.uploadImage(productId, this.selectedFile).subscribe((response: any) => {
        this.product.imageUrl = response.url;
        this.onSuccess(this.isEditMode ? 'Product Updated' : 'Product Created', this.isEditMode ? 'Product updated successfully' : 'Product created successfully');
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    }
  }

  onSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  resetForm() {
    this.product = {
      id: 0,
      title: '',
      description: '',
      price: undefined,
      quantity: undefined,
      status: '',
      category: '',
      code: '',
      imageUrl: '',
    };
    this.selectedStatus = null;
    this.selectedCategory = null;
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:5200${imageUrl}`;
  }

  discard(event: Event) {
    if (this.isEditMode) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this product?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          if (this.product && this.product.id) {
            this.productService.deleteProduct(this.product.id).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Product Deleted', detail: 'Product deleted successfully' });
              this.router.navigate(['/products']);
            });
          }
        }
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  backClicked() {
    this._location.back();
  }
}
