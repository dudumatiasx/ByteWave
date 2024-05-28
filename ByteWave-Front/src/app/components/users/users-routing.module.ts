import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewUserComponent } from './new-user/new-user.component';
import { UsersComponent } from './user-list/users.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: UsersComponent },
    { path: 'new', component: NewUserComponent, data: { title: 'Add User' } },
    { path: 'edit/:id', component: NewUserComponent, data: { title: 'Edit User' } },
  ])],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
