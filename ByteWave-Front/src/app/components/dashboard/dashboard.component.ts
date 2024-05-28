import { Component, OnInit, ElementRef } from '@angular/core';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { CustomerService } from 'src/services/customer.service';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lineData: any;
  lineOptions: any;

  pieData: any;
  pieOptions: any;

  barOptions: any;
  barData: any;

  displayMonthsSales: number = 6;
  displayMonthsOrders: number = 6;

  showCharts: boolean = true;

  monthSales: number = 0;
  monthOrders: number = 0;
  totalCustomers: number = 0;
  outOfStockProducts: number = 0;
  salesGrowth: number = 0;
  ordersGrowth: number = 0;
  newCustomers: number = 0;

  userRole: string | null = '';
  userEmail: string | null = '';

  constructor(
    private elRef: ElementRef,
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  toggleChartsVisibility(): void {
    this.showCharts = !this.showCharts;
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUser(userId);
    }

    this.userRole = this.authService.getUserRole();
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.userEmail = user.email;
      this.loadDashboardData();
      this.initSalesChart(this.displayMonthsSales);
      this.initOrdersChart(this.displayMonthsOrders);
    });
  }

  toggleMonthsSales(): void {
    this.displayMonthsSales = this.displayMonthsSales === 6 ? 3 : 6;
    this.initSalesChart(this.displayMonthsSales);
  }

  toggleMonthsOrders(): void {
    this.displayMonthsOrders = this.displayMonthsOrders === 6 ? 3 : 6;
    this.initOrdersChart(this.displayMonthsOrders);
  }

  getLastMonthsLabels(months: number): string[] {
    const today = new Date();
    const lastMonthsLabels = [];
    let month = today.getMonth();
    let year = today.getFullYear();
    for (let i = 0; i < months; i++) {
      if (month < 0) {
        month = 11;
        year--;
      }
      lastMonthsLabels.unshift(this.getMonthName(month));
      month--;
    }
    return lastMonthsLabels;
  }

  getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  }

  initOrdersChart(months: number) {
    this.orderService.getOrders().subscribe((orders) => {
      const labels = this.getLastMonthsLabels(months);
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      const filteredOrders = this.filterOrders(orders);

      const ordersData = this.aggregateOrdersByMonth(filteredOrders, months);

      this.barData = {
        labels: labels,
        datasets: [
          {
            data: ordersData,
            backgroundColor: 'rgb(46, 185, 245)',
            borderRadius: 6,
            barThickness: 26,
            maxBarThickness: 20,
          }
        ]
      };

      this.barOptions = {
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              fontColor: textColor,
            },
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              display: false,
              drawBorder: false,
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
        }
      };
    });
  }

  initSalesChart(months: number) {
    this.orderService.getOrders().subscribe((orders) => {
      const labels = this.getLastMonthsLabels(months);
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      const filteredOrders = this.filterOrders(orders);

      const salesData = this.aggregateSalesByMonth(filteredOrders, months);

      setTimeout(() => {
        const canvas = this.elRef.nativeElement.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
        gradientFill.addColorStop(0, 'rgba(46, 185, 245, 0.7)');
        gradientFill.addColorStop(0.9, 'rgba(46, 185, 245, 0)');

        this.lineData = {
          labels: labels,
          datasets: [
            {
              data: salesData,
              fill: true,
              backgroundColor: gradientFill,
              borderColor: 'rgb(46, 185, 245)',
              tension: 0.1,
              pointBackgroundColor: 'rgb(46, 185, 245, 0)',
              pointBorderColor: 'rgb(46, 185, 245, 0)',
              pointRadius: 7,
              pointHoverBackgroundColor: 'rgb(46, 185, 245)',
              pointHoverBorderWidth: 2,
              pointHoverRadius: 7,
              pointHoverBorderColor: 'rgb(255, 255, 255)',
            }
          ]
        };

        this.lineOptions = {
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
              labels: {
                pointBackgroundColor: 'rgb(46, 185, 245)',
                fontColor: textColor
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                callback: function (value: number) {
                  return '$' + value.toFixed(2);
                },
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
          }
        };
      }, 0);
    });
  }

  loadDashboardData(): void {
    this.orderService.getOrders().subscribe((orders) => {
      const filteredOrders = this.filterOrders(orders);
      this.monthOrders = filteredOrders.length;
      this.salesGrowth = this.calculateGrowth(filteredOrders, 'sales');
      this.ordersGrowth = this.calculateGrowth(filteredOrders, 'orders');
      this.monthSales = this.calculateMonthlySales(filteredOrders);
    });

    this.productService.getProducts().subscribe((products) => {
      this.outOfStockProducts = products.filter(p => p.quantity === 0).length;
    });

    this.customerService.getCustomers().subscribe((customers) => {
      this.totalCustomers = customers.length;
      this.newCustomers = this.calculateNewCustomers(customers);
    });
  }

  filterOrders(orders: any[]): any[] {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (this.userRole === 'Admin') {
      return orders.filter(order => {
        const orderMonth = new Date(order.orderDate).getMonth();
        const orderYear = new Date(order.orderDate).getFullYear();
        return orderMonth === currentMonth && orderYear === currentYear;
      });
    } else if (this.userRole === 'Seller') {
      return orders.filter(order => {
        const orderMonth = new Date(order.orderDate).getMonth();
        const orderYear = new Date(order.orderDate).getFullYear();
        return order.sellerEmail === this.userEmail && orderMonth === currentMonth && orderYear === currentYear;
      });
    }
    return [];
  }

  aggregateSalesByMonth(orders: any[], months: number): number[] {
    const salesData = Array(months).fill(0);
    const today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const sales = order.totalAmount;

      if (orderYear === year || orderYear === year - 1) {
        let monthIndex = month - orderMonth;
        if (orderYear < year) {
          monthIndex += 12;
        }

        if (monthIndex < months && monthIndex >= 0) {
          salesData[months - 1 - monthIndex] += sales;
        }
      }
    });

    return salesData;
  }

  aggregateOrdersByMonth(orders: any[], months: number): number[] {
    const ordersData = Array(months).fill(0);
    const today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      if (orderYear === year || orderYear === year - 1) {
        let monthIndex = month - orderMonth;
        if (orderYear < year) {
          monthIndex += 12;
        }

        if (monthIndex < months && monthIndex >= 0) {
          ordersData[months - 1 - monthIndex]++;
        }
      }
    });

    return ordersData;
  }

  calculateMonthlySales(orders: any[]): number {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return orders.reduce((sum, order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        return sum + order.totalAmount;
      }
      return sum;
    }, 0);
  }

  calculateGrowth(orders: any[], type: 'sales' | 'orders'): number {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const lastMonthSales = orders.reduce((sum, order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate.getMonth() === currentMonth - 1 && orderDate.getFullYear() === currentYear) {
        return sum + (type === 'sales' ? order.totalAmount : 1);
      }
      return sum;
    }, 0);

    const currentMonthSales = orders.reduce((sum, order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        return sum + (type === 'sales' ? order.totalAmount : 1);
      }
      return sum;
    }, 0);

    if (lastMonthSales === 0) {
      return currentMonthSales > 0 ? 100 : 0;
    }

    return ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
  }

  calculateNewCustomers(customers: any[]): number {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return customers.filter((customer) => {
      const customerDate = new Date(customer.createdDate);
      return customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;
    }).length;
  }
}
