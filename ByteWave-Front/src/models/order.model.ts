import { Customer } from './customer.model';
import { Product } from './product.model';

export interface Order {
  id: number;
  customerId: number;
  sellerEmail: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
  customer: Customer | null;
  orderProducts: OrderProduct[];
}

export interface OrderProduct {
  productId: number;
  quantity: number;
}
