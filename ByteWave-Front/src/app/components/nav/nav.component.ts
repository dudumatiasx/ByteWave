import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  items: MenuItem[] | undefined;
  userItems: MenuItem[] | undefined;
  username: string | undefined = undefined;
  userRole: string | undefined = undefined;

constructor(private router: Router, private authService: AuthService) { }

  sidebarVisible: boolean = false;

  ngOnInit() {
    this.authService.getUserObservable().subscribe(user => {
      if (user) {
        this.username = user.sub;
        this.userRole = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.setupMenuItems();
      } else {
        this.username = undefined;
        this.userRole = undefined;
      }
    });

    this.setupMenuItems();
  }

  setupMenuItems() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'icon-home',
        routerLink: '/dashboard',
        items: [],
        visible: this.userRole === 'Admin' || this.userRole === 'Seller'
      },
      {
        label: 'Orders',
        icon: 'icon-inbox',
        items: [
          {
            label: 'Order List',
            icon: 'icon-inbox',
            routerLink: '/orders',
            items: [],
          },
          {
            label: 'New Order',
            icon: 'icon-plus',
            routerLink: '/orders/new'
          }
        ],
        visible: this.userRole === 'Admin' || this.userRole === 'Seller'
      },
      {
        label: 'Products',
        icon: 'icon-tag',
        items: [
          {
            label: 'Product List',
            icon: 'icon-tag',
            routerLink: '/products',
            items: [],
          },
          {
            label: 'Add Product',
            icon: 'icon-plus',
            routerLink: '/products/new'
          },
          {
            separator: true,
          },
          {
            label: 'Inventory',
            icon: 'icon-archive-restore',
            routerLink: '/inventory',
            items: [],
          },
          {
            separator: true,
          },
          {
            label: 'Catalog',
            icon: 'icon-layout-list',
            routerLink: '/catalog',
            items: [],
          },
        ],
        visible: this.userRole === 'Admin' || this.userRole === 'Seller'
      },
      {
        label: 'Catalog',
        icon: 'icon-layout-list',
        routerLink: '/catalog',
        items: [],
        visible: this.userRole === 'Customer'
      },
      {
        label: 'Customers',
        icon: 'icon-user',
        items: [
          {
            label: 'Customer List',
            icon: 'icon-users',
            routerLink: '/customers',
          },
          {
            label: 'Add Customer',
            icon: 'icon-user-plus',
            routerLink: '/customers/new',
            items: [],
          }
        ],
        visible: this.userRole === 'Admin' || this.userRole === 'Seller'
      },
      {
        label: 'Admin',
        icon: 'icon-lock-keyhole',
        items: [
          {
            label: 'User list',
            icon: 'icon-users',
            routerLink: '/users',
          },
          {
            label: 'Add User',
            icon: 'icon-user-plus',
            routerLink: '/users/new',
            items: [],
          }
        ],
        visible: this.userRole === 'Admin'
      },
      {
        label: 'Orders',
        icon: 'icon-clipboard-list',
        routerLink: '/order-history',
        items: [],
        visible: this.userRole === 'Customer'
      },
    ];

    this.userItems = [
      {
        label: 'Profile',
        icon: 'icon-user',
        routerLink: '/profile'
      },
      {
        label: 'Sign out',
        icon: 'icon-log-out',
        command: () => this.logout()
      }
    ];
  }

  showThis(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/notfound' && this.router.url !== '/register';
  }

  logout() {
    this.authService.logout();
  }
}
