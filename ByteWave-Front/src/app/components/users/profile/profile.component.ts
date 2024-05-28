import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent implements OnInit {
  user: any = {
    id: '',
    userName: '',
    email: ''
  };

  existingUserError: boolean = false;
  emailInvalid: boolean = false;

  displayChangePasswordDialog: boolean = false;
  changePasswordData: any = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private _location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.user = user;
    });
  }

  checkUserExists(username: string) {
    this.existingUserError = this.user.some((user: { userName: string; id: any; }) => user.userName === username && user.id !== this.user.id);
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    this.emailInvalid = !emailPattern.test(this.user.email);
  }

  saveUser() {
    this.validateEmail();

    if (this.emailInvalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email format' });
      return;
    }

    this.userService.updateUser(this.user).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'User Updated', detail: 'User updated successfully' });
    });
  }

  openChangePasswordDialog() {
    this.displayChangePasswordDialog = true;
  }

  closeChangePasswordDialog() {
    this.displayChangePasswordDialog = false;
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  }

  changePassword() {
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmNewPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
      return;
    }

    this.userService.changePassword(this.user.id, this.changePasswordData).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Password Changed', detail: 'Password changed successfully' });
      this.closeChangePasswordDialog();
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  backClicked() {
    this._location.back();
  }
}
