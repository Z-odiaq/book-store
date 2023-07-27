import { Component,OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.Service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})

export class ManageUsersComponent implements OnInit {
  users: User[] = []; // Initialize with your user data here
  FilteredUsers: User[] = [];
  selectedUser: any =  {} as User;
  isEditMode = false;
  searchQuery = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.FilteredUsers = users;
    });
  }
  applySearch() {
    this.FilteredUsers = this.users.filter(user => {
      return user.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }

    // Clear the form fields and exit the edit mode.
    this.cancelEdit();
  }
  createUser() {
    this.userService.registerUser(this.selectedUser).subscribe(
      (user: any) => {
        this.users.push(user.user);
        this.FilteredUsers.push(user.user);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          alert('User with the same email already exists. Please use a different email.');
        } else {
          alert('An error occurred while registering the user. Please try again later.');
        }
      }
    );
  }
  updateUser() {
    this.userService.updateUser(this.selectedUser).subscribe(user => {
      const index = this.users.findIndex(u => u._id === user._id);
      this.users[index] = user;
      this.FilteredUsers[index] = user;
    });
  }

  editUser(user: User) {
   
    this.selectedUser = user
    this.isEditMode = true;
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user._id !== userId);
      this.FilteredUsers = this.FilteredUsers.filter(user => user._id !== userId);
    });

  }

  cancelEdit() {
    // Clear the selectedUser object and exit the edit mode.
    this.selectedUser = { _id: '', firstname: '', lastname: '', email: '', role: 'user' };
    this.isEditMode = false;
  }
}
