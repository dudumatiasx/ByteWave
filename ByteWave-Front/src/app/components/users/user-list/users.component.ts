import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  editUser(user: any) {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.deleteUser(userId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'User Deleted', detail: 'User deleted successfully' });
          this.loadUsers();
        });
      }
    });
  }
}
