import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class NewUserComponent implements OnInit {

  @Input() title = '';
  isEditMode: boolean = false;

  users: any[] = [];
  newUser: any = {
    id: '',
    userName: '',
    email: '',
    role: '',
    password: 'Default@123'
  };
  existingUserError: boolean = false;
  emailInvalid: boolean = false;
  roleError: boolean = false;

  selectedRole: string | null = null;

  roles: any[] = [
    { name: 'Admin', key: 'Admin' },
    { name: 'Seller', key: 'Seller' },
    { name: 'Customer', key: 'Customer' }
  ];

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
    this.isEditMode = this.title === 'Edit User';
    if (this.isEditMode) {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.loadUser(userId);
      }
    }
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.newUser = user;
      this.selectedRole = user.role;
      this.newUser.password = '******';
    });
  }

  checkUserExists(username: string) {
    if (this.isEditMode && username === this.newUser.userName) {
      this.existingUserError = false;
      return;
    }
    this.existingUserError = this.users.some(user => user.userName === username && user.id !== this.newUser.id);
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    this.emailInvalid = !emailPattern.test(this.newUser.email);
  }

  saveUser() {
    this.checkUserExists(this.newUser.userName);
    this.validateEmail();
    this.roleError = !this.selectedRole;

    if (this.existingUserError) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username already exists' });
      return;
    }

    if (this.emailInvalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email format' });
      return;
    }

    if (this.roleError) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role must be selected' });
      return;
    }

    if (this.isEditMode) {
      delete this.newUser.password;
      this.newUser.role = this.selectedRole;
      this.userService.updateUser(this.newUser).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'User Updated', detail: 'User updated successfully' });
        this.router.navigate(['/users']);
      });
    } else {
      this.newUser.role = this.selectedRole;
      this.userService.createUser(this.newUser).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'User Created', detail: 'User created successfully' });
        this.router.navigate(['/users']);
      });
    }
  }

  resetForm() {
    this.newUser = {
      id: '',
      userName: '',
      email: '',
      role: '',
      password: 'Default@123'
    };
    this.selectedRole = null;
  }

  discard(event: Event) {
    if (this.isEditMode) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this user?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.userService.deleteUser(this.newUser.id).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'User Deleted', detail: 'User deleted successfully' });
            this.router.navigate(['/users']);
          });
        }
      });
    } else {
      this.router.navigate(['/users']);
    }
  }

  backClicked() {
    this._location.back();
  }
}
